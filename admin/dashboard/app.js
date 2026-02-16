// app.js


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

if (!token || !role || (role !== "admin")) {
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

// =============================
// AUTH HELPERS
// =============================
function getToken() {
  return localStorage.getItem("token");
}

function getAuthHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function redirectToLogin() {
  localStorage.clear();
  window.location.href = "../../auth/login.html";
}

// =============================
// LOAD USER PROFILE
// =============================
async function loadUser() {
  try {
    const token = getToken();
    if (!token) {
      redirectToLogin();
      return;
    }

    const res = await fetch(`${API}/auth/me`, {
      headers: getAuthHeaders(),
      cache: "no-store", // disable cache
    });

    if (!res.ok) {
      console.error("User fetch failed:", res.status, await res.text());
      redirectToLogin();
      return;
    }

    const user = await res.json();
    const fullName = `${user.firstName} ${user.lastName}`;
    const avatar =
      user.avatar && user.avatar !== ""
        ? user.avatar
        : "https://i.pravatar.cc/80?img=12";

    document.getElementById("sidebarName").textContent = fullName;
    document.getElementById("sidebarAvatar").src = avatar;
    document.getElementById(
      "welcomeText"
    ).textContent = `Welcome back, ${user.firstName}! Here’s your system performance and waste management metrics`;
    document.getElementById("topAvatar").src = avatar;

    return user;
  } catch (err) {
    console.error("User load error:", err);
    redirectToLogin();
  }
}

// =============================
// RENDER STATS
// =============================
function renderStats(totalReports, resolvedPercent, staffCount) {
  const stats = document.getElementById("stats");
  if (!stats) return;

  stats.innerHTML = `
    <div class="stat-card">
      <h3>Total Reports</h3>
      <p>${totalReports}</p>
    </div>

    <div class="stat-card">
      <h3>Resolved Issues</h3>
      <p>${resolvedPercent}%</p>
    </div>

    <div class="stat-card">
      <h3>Active Fleet</h3>
      <p>${staffCount}</p>
    </div>
  `;
}

// =============================
// DASHBOARD STATS
// =============================
async function loadDashboardStats() {
  try {
    const reportsRes = await fetch(`${API}/allReports?limit=1000&_=${Date.now()}`, {
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    if (!reportsRes.ok) throw new Error("Failed to fetch reports");

    const reportsData = await reportsRes.json();

    // Extract array from API response, whether from DB or cache
const reports = Array.isArray(reportsData.reports)
  ? reportsData.reports
  : Array.isArray(reportsData.reports?.reports)
    ? reportsData.reports.reports
    : Object.values(reportsData.reports || []);


    const totalReports = reports.length;
    const completedReports = reports.filter((r) => r.status === "COMPLETED")
      .length;
    const resolvedPercent =
      totalReports > 0 ? ((completedReports / totalReports) * 100).toFixed(1) : 0;

    const usersRes = await fetch(`${API}/auth/users?limit=1000&_=${Date.now()}`, {
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    if (!usersRes.ok) throw new Error("Failed to fetch users");

    const usersData = await usersRes.json();
    const users = usersData?.users
      ? Array.isArray(usersData.users)
        ? usersData.users
        : Object.values(usersData.users)
      : [];
    const staffCount = users.filter((u) => u.role === "staff").length;

    renderStats(totalReports, resolvedPercent, staffCount);
  } catch (err) {
    console.error("Stats load error:", err);
  }
}

// =============================
// LOAD ALL REPORTS
// =============================
async function loadAllReports() {
  try {
    const res = await fetch(`${API}/allReports?limit=100&_=${Date.now()}`, {
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch reports");

    const data = await res.json();

    const reports = data?.reports?.reports
      ? Array.isArray(data.reports.reports)
        ? data.reports.reports
        : Object.values(data.reports.reports)
      : Array.isArray(data.reports)
        ? data.reports
        : [];

    const tbody = document.getElementById("tbody");
    tbody.innerHTML = "";

    if (reports.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5">No reports found</td>
        </tr>
      `;
      return;
    }

    reports.forEach((report) => {
      const tr = document.createElement("tr");
      const status = report.status || "UNKNOWN";
      tr.innerHTML = `
        <td>${report.trackingId || report._id}</td>
        <td>${report.category || "N/A"}</td>
        <td>${report.address || "N/A"}</td>
        <td>
          <span class="status-badge ${status.toLowerCase()}">
            ${status}
          </span>
        </td>
        <td>
          <button class="view-btn" onclick="viewReport('${
            report.trackingId || report._id
          }')">View</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Reports load error:", err);
  }
}


// =============================
// VIEW REPORT
// =============================
function viewReport(trackingId) {
  window.location.href = `../../worker/task/index.html?trackingId=${trackingId}`;
}

// =============================
// INITIALIZE DASHBOARD
// =============================
document.addEventListener("DOMContentLoaded", async () => {
  const token = getToken();
  if (!token) {
    redirectToLogin();
    return;
  }

  const user = await loadUser();
  if (!user) return;

  loadDashboardStats();
  loadAllReports();
});




/* ---------- Donut chart (SVG segments) ---------- */
const donutData = [
  { label: "Organic", pct: 32, color: "#00c853" },
  { label: "Recyclable", pct: 24, color: "#98fca5" },
  { label: "Waste", pct: 21, color: "#0b3d16" },
  { label: "Non", pct: 18, color: "#ff4d4d" },
  { label: "Inorganic", pct: 15, color: "#b45309" },
  { label: "Others", pct: 11, color: "#6b7280" },
];

const r = 44;
const C = 2 * Math.PI * r;
let offset = 0;

const segmentsG = $("#donutSegments");
segmentsG.innerHTML = donutData
  .map((d) => {
    const dash = (d.pct / 100) * C;
    const seg = `
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
    offset += dash;
    return seg;
  })
  .join("");

/* Legend */
const legendList = $("#legendList");
legendList.innerHTML = donutData
  .map(
    (d) => `
  <div class="leg">
    <span class="dot" style="background:${d.color}"></span>
    <span>${d.label}</span>
    <span style="color:#111827;font-weight:900;">${d.pct}%</span>
  </div>
`,
  )
  .join("");