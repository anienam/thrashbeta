//resident-dashboard.js

//const API = 'http://localhost:5000/api/v1';   // Development 

const API = 'https://trashbeta.onrender.com/api/v1'    //Production

const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");
const email = localStorage.getItem("email");
const role = localStorage.getItem("role");

// TOKEN CHECK & AUTO LOGOUT
function clearUserSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("role");
  localStorage.removeItem("email");
  localStorage.removeItem("onboardingStep");
}


if (token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = payload.exp * 1000 - Date.now();

    // If expired already
    if (expiryTime <= 0) {
      alert("Your session has expired. Please log in again.");
      clearUserSession();
      window.location.href = "../auth/login.html";
    } else {
      // Auto logout when it expires
      setTimeout(() => {
        alert("Your session has expired. Please log in again.");
        clearUserSession();
        window.location.href = "../auth/login.html";
      }, expiryTime);
    }
  } catch (err) {
    alert("Invalid session. Please log in again.");
    clearUserSession();
    window.location.href = "../auth/login.html";
  }
} else {
  alert("Kindly login");
    clearUserSession();
    window.location.href = "../auth/login.html";
}


const firstName = localStorage.getItem("firstName") || "Resident";


// ===============================
// Load Dashboard Data


// ===============================
// Set Welcome Name
// ===============================
function setWelcome() {
  document.getElementById("welcomeName").textContent =
    `Welcome back, ${firstName}!`;
}



// ===============================
// Fetch User Reports
// ===============================
async function loadRecentReports() {
  try {
    const res = await fetch(`${API}/reports`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const reports = await res.json();

    // Total number of reports
    document.getElementById("activeReports").textContent = reports.length;

    // Get latest 3 reports
    const recentReports = reports.slice(0, 3);

    renderReports(recentReports);

  } catch (err) {
    console.error("Dashboard error:", err);
  }
}



// ===============================
// Render Reports Table
// ===============================
function renderReports(reports) {

  const tbody = document.getElementById("recentReportsBody");

  tbody.innerHTML = "";

  if (!reports.length) {
    tbody.innerHTML = `<tr><td colspan="8">No reports yet</td></tr>`;
    return;
  }

  reports.forEach(report => {

    const image = report.images?.[0] || "/assets/images/no-image.png";

    const row = `
      <tr>
        <td>
          <img class="thumb" src="${image}" alt="Report photo" />
        </td>

        <td>${report.trackingId}</td>

        <td>${formatCategory(report.category)}</td>

        <td>${report.lga}</td>

        <td>${formatDate(report.createdAt)}</td>

        <td>
          <span class="pill pill--${report.priority.toLowerCase()}">
            ${report.priority}
          </span>
        </td>

        <td>
          <span class="status status--${formatStatusClass(report.status)}">
            ${formatStatusText(report.status)}
          </span>
        </td>

        <td class="td-actions">
          <button class="kebab">⋮</button>
        </td>
      </tr>
    `;

    tbody.insertAdjacentHTML("beforeend", row);
  });
}



// ===============================
// Helper Functions
// ===============================

function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

function formatCategory(cat) {
  return cat.charAt(0).toUpperCase() + cat.slice(1);
}

function formatStatusText(status) {
  return status.replace("_", " ");
}

function formatStatusClass(status) {
  return status.toLowerCase().replace("_", "-");
}





// ===============================
// Load User Details
// ===============================
async function loadUserDetails() {
  try {
    const res = await fetch(`${API}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Failed to fetch user");

    const user = await res.json();

    // Update welcome name
    document.getElementById("welcomeName").textContent =
      `Welcome back, ${user.firstName}!`;

    // Update sidebar name and email
    const nameEl = document.querySelector(".user-mini__name");
    const subEl = document.querySelector(".user-mini__sub");
    nameEl.textContent = `${user.firstName} ${user.lastName}`;
    subEl.textContent = user.email;

    // Update avatar
    const avatarEls = document.querySelectorAll(".user-mini__avatar, .avatar-btn img");

    let avatarUrl = user.avatar || user.profile?.avatar || "/assets/images/Avatar profile photo5.png";

    // If avatar is a relative path, prepend API host
    if (avatarUrl && !avatarUrl.startsWith("http")) {
      avatarUrl = `${API}/${avatarUrl.replace(/^\/+/, '')}`; // remove leading slash if exists
    }

    avatarEls.forEach(img => img.src = avatarUrl);

  } catch (err) {
    console.error("Error loading user details:", err);
  }
}


// ===============================
// Load Dashboard Data
// ===============================
document.addEventListener("DOMContentLoaded", async () => {
  setWelcome();
  await loadRecentReports();
  await loadUserDetails(); 
});
