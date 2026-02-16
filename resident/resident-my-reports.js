//resident-my-reports.js

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


const reportsBody = document.getElementById("reportsBody");
const searchInput = document.getElementById("searchInput");
const tabs = document.querySelectorAll(".tab");

const tableInfo = document.getElementById("tableInfo");
const prevBtn = document.getElementById("prevPage");
const nextBtn = document.getElementById("nextPage");
const pageNumber = document.getElementById("pageNumber");

let allReports = [];
let filteredReports = [];
let currentPage = 1;
const limit = 5;
let currentStatus = "all";


// ===============================
// FETCH USER REPORTS
// ===============================
async function fetchReports() {
  try {
    const res = await fetch(`${API}/reports`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to fetch reports");
      return;
    }

    allReports = data;
    applyFilters();

  } catch (err) {
    console.error(err);
  }
}


// ===============================
// FILTER LOGIC
// ===============================
function applyFilters() {

  filteredReports = allReports.filter(report => {

    // STATUS FILTER
    const statusMatch =
      currentStatus === "all" ||
      report.status === currentStatus.toUpperCase();

    // SEARCH FILTER
    const searchValue = searchInput.value.toLowerCase();

    const searchMatch =
      report.trackingId.toLowerCase().includes(searchValue) ||
      report.address.toLowerCase().includes(searchValue) ||
      report.category.toLowerCase().includes(searchValue);

    return statusMatch && searchMatch;
  });

  currentPage = 1;
  renderReports();
}


// ===============================
// RENDER TABLE
// ===============================
function renderReports() {

  reportsBody.innerHTML = "";

  if (filteredReports.length === 0) {
    reportsBody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center;">No reports found</td>
      </tr>
    `;
    tableInfo.textContent = "Showing 0 reports";
    return;
  }

  const start = (currentPage - 1) * limit;
  const end = start + limit;

  const pageData = filteredReports.slice(start, end);

  pageData.forEach(report => {

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        ${
          report.images?.length
            ? `<img src="${report.images[0]}" width="50" height="50" />`
            : "—"
        }
      </td>
      <td>${report.trackingId}</td>
      <td>${report.category}</td>
      <td>${report.address}</td>
      <td>${new Date(report.createdAt).toLocaleDateString()}</td>
      <td>${report.priority}</td>
      <td>
        <span class="status ${report.status.toLowerCase()}">
          ${report.status.replace("_", " ")}
        </span>
      </td>
      <td>
        <button onclick="viewReport('${report.trackingId}')">View</button>
      </td>
    `;

    reportsBody.appendChild(row);
  });

  tableInfo.textContent = `Showing ${pageData.length} of ${filteredReports.length} reports`;
  pageNumber.textContent = currentPage;
}


// ===============================
// TAB CLICK
// ===============================
tabs.forEach(tab => {
  tab.addEventListener("click", () => {

    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    currentStatus = tab.dataset.status;
    applyFilters();
  });
});


// ===============================
// SEARCH INPUT
// ===============================
searchInput.addEventListener("input", () => {
  applyFilters();
});


// ===============================
// PAGINATION
// ===============================
nextBtn.addEventListener("click", () => {
  if (currentPage * limit < filteredReports.length) {
    currentPage++;
    renderReports();
  }
});

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderReports();
  }
});


// ===============================
// VIEW REPORT
// ===============================
function viewReport(id) {
  window.location.href = `resident-track-issue.html?trackingId=${id}`;
}





// ===============================
// Load User Details
// ===============================
async function loadUserDetails() {
  try {
    const res = await fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Failed to fetch user");

    const user = await res.json();

    // Save firstName locally for welcome message
    localStorage.setItem("firstName", user.firstName);

    // Update welcome
    const welcomeEl = document.getElementById("welcomeName");
    if (welcomeEl) welcomeEl.textContent = `Welcome back, ${user.firstName}!`;

    // Update sidebar
    const nameEl = document.querySelector(".user-mini__name");
    const subEl = document.querySelector(".user-mini__sub");
    if (nameEl) nameEl.textContent = `${user.firstName} ${user.lastName}`;
    if (subEl) subEl.textContent = user.email;

    // Update avatar
    const avatarEls = document.querySelectorAll(".user-mini__avatar, .avatar-btn img");
    let avatarUrl = user.profile?.avatar || "/assets/images/Avatar profile photo5.png";

    if (avatarUrl && !avatarUrl.startsWith("http")) {
      avatarUrl = `${API}/${avatarUrl.replace(/^\/+/, '')}`;
    }

    avatarEls.forEach(img => (img.src = avatarUrl));

  } catch (err) {
    console.error("Error loading user details:", err);
  }
}

function setWelcome() {
  const welcomeEl = document.getElementById("welcomeName");
  const firstName = localStorage.getItem("firstName") || "Resident";
  if (welcomeEl) {
    welcomeEl.textContent = `Welcome back, ${firstName}!`;
  }
}

// ===============================
// Load Dashboard Data
// ===============================
document.addEventListener("DOMContentLoaded", async () => {
  setWelcome();
  await fetchReports();
  await loadUserDetails(); 
});






