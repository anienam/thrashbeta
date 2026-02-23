//const API = "http://localhost:5000/api/v1"; 
const API = "https://trashbeta.onrender.com/api/v1";

const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");
const email = localStorage.getItem("email");
const role = localStorage.getItem("role");

// =============================
// SESSION HANDLING
// =============================
function clearUserSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("role");
  localStorage.removeItem("email");
  localStorage.removeItem("onboardingStep");
}

if (!token || !role || ( role !== "admin")) {
  clearUserSession();
  window.location.href = "../../auth/login.html";
} else {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiryTime = payload.exp * 1000 - Date.now();
    if (expiryTime <= 0) {
      clearUserSession();
      window.location.href = "../../auth/login.html";
    } else {
      setTimeout(() => {
        clearUserSession();
        window.location.href = "../../auth/login.html";
      }, expiryTime);
    }
  } catch (err) {
    clearUserSession();
    window.location.href = "../../auth/login.html";
  }
}

/* =========================================================
   AUTH HEADERS
========================================================= */
function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
}

/* =========================================================
   USER PROFILE (NAME + AVATAR)
========================================================= */
async function loadUserProfile() {
  try {
    const res = await fetch(`${API}/auth/me`, { headers: authHeaders() });
    const user = await res.json();

    const fullName = `${user.firstName} ${user.lastName}`;
    const avatar = user.avatar || "https://i.pravatar.cc/80?img=12";

    document.querySelector(".userchip__name").textContent = fullName;
    document.querySelector(".userchip__avatar").src = avatar;
    document.querySelector(".avatar").src = avatar;
  } catch (err) {
    console.error("Failed to load user profile", err);
  }
}

/* =========================================================
   REPORT STATS (KPI CARDS)
========================================================= */
async function loadStats() {
  try {
    const res = await fetch(`${API}/stats`, { headers: authHeaders() });
    const text = await res.text();
    if (!res.ok) {
      document.getElementById("stats").innerHTML = `
        <div style="text-align:center; color:red;">
          Failed to load stats (${res.status})
        </div>
      `;
      return;
    }

    const stats = JSON.parse(text);

    document.getElementById("stats").innerHTML = `
      <div class="stat-card">
        <h3>Total Active Reports</h3>
        <p class="stat-value">${stats.totalActive}</p>
        <span class="stat-change">
          ${stats.percentChange}% vs last month
        </span>
      </div>

      <div class="stat-card">
        <h3>Pending Review</h3>
        <p class="stat-value">${stats.pending}</p>
      </div>

      <div class="stat-card">
        <h3>In Progress</h3>
        <p class="stat-value">${stats.inProgress}</p>
      </div>

      <div class="stat-card">
        <h3>Resolution Rate</h3>
        <p class="stat-value">94.2%</p>
      </div>
    `;
  } catch (err) {
    console.error("Stats error:", err);
  }
}

/* =========================================================
   LOAD REPORTS (WITH CATEGORY FILTER)
========================================================= */
let currentCategory = "All";

const categoryMap = {
  "All": null,
  "Missed PickUp": "missed",
  "Trashed": "blocked",
  "Overflowing Bin": "overflowing",
  "Illegal Dumping": "illegal"
};

async function loadReports(category = "All") {
  try {
    let backendCategory = categoryMap[category] || null;
    let url = `${API}/allReports?page=1&limit=20`;
    if (backendCategory) url += `&category=${backendCategory}`;

    const res = await fetch(url, { headers: authHeaders() });
    if (!res.ok) {
      console.error("Failed to fetch reports:", res.status);
      return;
    }

    const data = await res.json();
    let reportsArray = [];

    if (Array.isArray(data.reports)) {
      reportsArray = data.reports;
    } else if (data.reports && Array.isArray(data.reports.reports)) {
      reportsArray = data.reports.reports;
    }

    renderReports(reportsArray);
  } catch (err) {
    console.error("Failed to load reports", err);
  }
}

/* =========================================================
   RENDER REPORT TABLE
========================================================= */
function renderReports(reports) {
  const tbody = document.getElementById("tbody");
  tbody.innerHTML = "";

  if (!Array.isArray(reports) || reports.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;">
          No reports found
        </td>
      </tr>
    `;
    return;
  }

  reports.forEach(report => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${report.trackingId || "-"}</td>
      <td>${report.category || "-"}</td>
      <td>${report.lga || "-"}, ${report.state || "-"}</td>
      <td>
        <span class="status ${(report.status || "").toLowerCase()}">
          ${report.status || "-"}
        </span>
      </td>
      <td>
        <button class="btn-view"
          onclick="viewReport('${report.trackingId}')">
          View
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

/* =========================================================
   VIEW REPORT
========================================================= */
function viewReport(trackingId) {
  window.location.href = `../../worker/task/index.html?trackingId=${trackingId}`;
}

/* =========================================================
   CATEGORY FILTER DROPDOWN
========================================================= */
const typeBtn = document.getElementById("typeBtn");
const typeDrop = document.getElementById("typeDrop");

typeBtn.addEventListener("click", () => {
  typeDrop.hidden = !typeDrop.hidden;
});

document.querySelectorAll(".drop-item").forEach(item => {
  item.addEventListener("click", () => {
    const selectedLabel = item.dataset.type;
    const backendCategory = categoryMap[selectedLabel] || "All";

    typeBtn.innerHTML = `Type ${selectedLabel} <span class="caret">▾</span>`;
    typeDrop.hidden = true;

    currentCategory = selectedLabel;
    loadReports(selectedLabel);
  });
});

/* =========================================================
   SIDEBAR TOGGLE (MOBILE)
========================================================= */
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

menuBtn?.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  overlay.hidden = !overlay.hidden;
});

overlay?.addEventListener("click", () => {
  sidebar.classList.remove("open");
  overlay.hidden = true;
});











// =============================
// DONUT CHART (Dynamic from Reports)
// =============================
async function loadDonutChart() {
  try {
    const res = await fetch(`${API}/allReports?limit=1000&_=${Date.now()}`, {
      headers: authHeaders(),
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch reports");

    const data = await res.json();

    const reports = Array.isArray(data.reports)
      ? data.reports
      : Array.isArray(data.reports?.reports)
      ? data.reports.reports
      : [];

    const totalReports = reports.length;

    // ✅ Update center total
    document.getElementById("donutTotal").textContent = totalReports;

    if (totalReports === 0) return;

    // Count categories
    const categoryCount = {};

    reports.forEach((report) => {
      const category = report.category || "other";
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    // Convert to percentage array
    const colors = {
      illegal: "#ef4444",
      overflowing: "#f97316",
      blocked: "#eab308",
      missed: "#3b82f6",
      general: "#10b981",
      burning: "#8b5cf6",
      uncategorized: "#6b7280",
      other: "#111827",
    };

    const donutData = Object.keys(categoryCount).map((cat) => {
      const pct = ((categoryCount[cat] / totalReports) * 100).toFixed(1);
      return {
        label: cat,
        pct: parseFloat(pct),
        color: colors[cat] || "#9ca3af",
      };
    });

    renderDonut(donutData);

  } catch (err) {
    console.error("Donut load error:", err);
  }
}





// =============================
// DONUT CHART (Dynamic from Reports)
// =============================
function renderDonut(donutData) {
  const r = 44;
  const C = 2 * Math.PI * r;
  let offset = 0;

  const segmentsG = document.getElementById("donutSegments");
  segmentsG.innerHTML = "";

  donutData.forEach((d) => {
    const dash = (d.pct / 100) * C;

    const circle = `
      <circle
        cx="60" cy="60" r="${r}"
        fill="none"
        stroke="${d.color}"
        stroke-width="14"
        stroke-linecap="butt"
        stroke-dasharray="${dash} ${C - dash}"
        stroke-dashoffset="${-offset}"
      ></circle>
    `;

    segmentsG.innerHTML += circle;
    offset += dash;
  });

  // Legend
  const legendList = document.getElementById("legendList");
  legendList.innerHTML = donutData
    .map(
      (d) => `
        <div class="leg">
          <span class="dot" style="background:${d.color}"></span>
          <span>${d.label}</span>
          <span style="color:#111827;font-weight:900;">${d.pct}%</span>
        </div>
      `
    )
    .join("");
}




/************************************************************
   MONTHLY BAR CHART (Dynamic from Reports)
*************************************************************/
async function loadMonthlyChart() {
  try {
    const res = await fetch(`${API}/allReports?limit=1000&_=${Date.now()}`, {
      headers: authHeaders(),
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch reports");

    const data = await res.json();

    const reports = Array.isArray(data.reports)
      ? data.reports
      : Array.isArray(data.reports?.reports)
      ? data.reports.reports
      : [];

    // Create 12-month array initialized to 0
    const monthlyCounts = new Array(12).fill(0);

    reports.forEach(report => {
      if (!report.createdAt) return;

      const date = new Date(report.createdAt);
      const month = date.getMonth(); // 0 = Jan, 11 = Dec
      monthlyCounts[month]++;
    });

    renderMonthlyBars(monthlyCounts);

  } catch (err) {
    console.error("Monthly chart error:", err);
  }
}


function renderMonthlyBars(monthlyCounts) {
  const container = document.getElementById("monthBars");
  container.innerHTML = "";

  const maxValue = Math.max(...monthlyCounts, 1); // prevent divide by 0

  monthlyCounts.forEach((count, index) => {
    const heightPercent = (count / maxValue) * 100;

    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${heightPercent}%`;
    bar.title = `${count} reports`;

    // Highlight current month
    const currentMonth = new Date().getMonth();
    if (index === currentMonth) {
      bar.classList.add("bar--active");
    }

    container.appendChild(bar);
  });
}







/* =========================================================
   PAGE INIT
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  loadUserProfile();
  loadStats();
  loadReports();
  loadDonutChart();
  loadMonthlyChart();
});
