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

/* =========================================================
   PAGE INIT
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  loadUserProfile();
  loadStats();
  loadReports();
});
