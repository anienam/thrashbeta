//app.js

//const API = 'http://localhost:5000/api/v1';   // Development
const API = 'https://trashbeta.onrender.com/api/v1' // Production

const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");
const email = localStorage.getItem("email");
const role = localStorage.getItem("role");

const routeList = document.getElementById("routeList");
const searchInput = document.getElementById("searchInput");
const logoutBtn = document.getElementById("goOfflineBtn");

let assignedReports = [];

if (!role || (role !== 'staff' && role !== 'admin')) {
  clearUserSession();
  window.location.href = "../auth/login.html";
}


// =============================
// SESSION MANAGEMENT
// =============================

function clearUserSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("role");
  localStorage.removeItem("email");
  localStorage.removeItem("onboardingStep");
}

function redirectToLogin() {
  window.location.href = "../../auth/login.html";
}

// Token validation + auto logout
(function validateSession() {

  if (!token) {
    alert("Kindly login");
    clearUserSession();
    return redirectToLogin();
  }

  try {

    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = payload.exp * 1000 - Date.now();

    if (expiryTime <= 0) {
      alert("Session expired. Login again.");
      clearUserSession();
      return redirectToLogin();
    }

    setTimeout(() => {
      alert("Session expired. Login again.");
      clearUserSession();
      redirectToLogin();
    }, expiryTime);

  } catch (err) {
    alert("Invalid session.");
    clearUserSession();
    redirectToLogin();
  }

})();


// =============================
// FETCH USER PROFILE
// =============================

async function loadWorkerProfile() {
  try {

    const res = await fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Failed to fetch profile");

    const user = await res.json();

    const nameEl = document.querySelector(".profile-name");
    const avatarImg = document.getElementById("profileAvatar");
    const avatarInitials = document.getElementById("avatarInitials");

    if (nameEl) {
      nameEl.textContent = `${user.firstName} ${user.lastName}`;
    }

    //  If user has uploaded avatar
    if (user.avatar) {
      avatarImg.src = user.avatar;
      avatarImg.style.display = "block";
      avatarInitials.style.display = "none";
    } else {
      //  Fallback to initials
      avatarInitials.textContent =
        `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`;
      avatarInitials.style.display = "block";
      avatarImg.style.display = "none";
    }

  } catch (err) {
    console.error("Profile Load Error:", err.message);
  }
}


// =============================
// FETCH ASSIGNED REPORTS
// =============================

async function loadReports() {

  try {

    const res = await fetch(`${API}/reports/assign/assigned`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Reports fetch failed:", data.message);
      assignedReports = [];
    } else {
      assignedReports = Array.isArray(data) ? data : [];
    }

    renderStats();
    renderRouteCards(assignedReports);

  } catch (err) {
    console.error("Reports Load Error:", err.message);
    assignedReports = [];
  }
}


// =============================
// RENDER DASHBOARD STATS
// =============================

function renderStats() {

  const total = assignedReports.length;

  const completed = assignedReports.filter(
    r => r.status === "COMPLETED"
  ).length;

  const urgent = assignedReports.filter(
    r => r.priority === "HIGH"
  ).length;

  const completedEl = document.querySelector(".big--green");
  const totalEl = document.querySelector(".big--muted");
  const urgentEl = document.querySelector(".big--amber");

  if (completedEl) completedEl.textContent = completed;
  if (totalEl) totalEl.textContent = `/${total}`;
  if (urgentEl) urgentEl.textContent = urgent;
}


// =============================
// RENDER TASK CARDS
// =============================

function renderRouteCards(reports) {

  if (!routeList) return;

  routeList.innerHTML = "";

  if (!reports.length) {
    routeList.innerHTML = `<p>No assigned tasks.</p>`;
    return;
  }

  reports.forEach(report => {

    const isCurrent = report.status === "IN_PROGRESS";

    const card = document.createElement("article");

    card.className =
      `task-card ${isCurrent ? "task-card--mint is-current" : "task-card--white"}`;

    card.dataset.id = report._id;
    card.dataset.search =
      `${report.trackingId} ${report.address} ${report.category}`.toLowerCase();

    card.innerHTML = `
      <div class="task-card__top">
        <div>
          <div class="task-title">${report.address || "No address"}</div>
          <div class="task-meta">
            <span class="task-meta__icon">♻</span>
            ${report.category || "Uncategorized"}
          </div>
        </div>

        ${report.priority === "HIGH"
          ? `<span class="tag tag--urgent">URGENT</span>`
          : ""
        }
      </div>

      <div class="task-card__actions">
        ${
          report.status !== "COMPLETED"
            ? `<button class="btn btn--green" data-complete="${report._id}">
                Mark Complete
              </button>`
            : `<span class="tag tag--current">COMPLETED</span>`
        }
      </div>
    `;

    routeList.appendChild(card);
  });
}


// =============================
// MARK TASK COMPLETE
// =============================

if (routeList) {
  routeList.addEventListener("click", async (e) => {

    const btn = e.target.closest("[data-complete]");
    if (!btn) return;

    const reportId = btn.dataset.complete;

    if (!reportId) return;

    try {

      const res = await fetch(`${API}/reports/${reportId}/complete`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        console.error("Failed to mark complete");
        return;
      }

      await loadReports();

    } catch (err) {
      console.error("Completion Error:", err.message);
    }

  });
}


// =============================
// SEARCH TASKS
// =============================

if (searchInput) {
  searchInput.addEventListener("input", () => {

    const term = searchInput.value.toLowerCase();

    const filtered = assignedReports.filter(r =>
      `${r.trackingId} ${r.address}`
        .toLowerCase()
        .includes(term)
    );

    renderRouteCards(filtered);
  });
}


// =============================
// LOGOUT
// =============================

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    clearUserSession();
    redirectToLogin();
  });
}


// =============================
// INIT
// =============================

loadWorkerProfile();
loadReports();
