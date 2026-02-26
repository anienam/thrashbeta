//resident-track-issue.js

//const API = 'http://localhost:5000/api/v1';   // Development

const API = "https://trashbeta.onrender.com/api/v1"; //Production

const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");
const email = localStorage.getItem("email");
const role = localStorage.getItem("role");

// TOKEN CHECK (optional for this page)
let authHeader = {};

function clearUserSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("role");
  localStorage.removeItem("email");
  localStorage.removeItem("onboardingStep");
}

if (token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiryTime = payload.exp * 1000 - Date.now();

    if (expiryTime <= 0) {
      clearUserSession();
    } else {
      setTimeout(() => {
        clearUserSession();
      }, expiryTime);

      authHeader = { Authorization: `Bearer ${token}` };
    }
  } catch (err) {
    clearUserSession();
  }
}


// =============================
// LOAD LOGGED-IN USER
// =============================

async function loadLoggedInUser() {
  if (!token) return;

  try {
    const res = await fetch(`${API}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch user");

    const user = await res.json();

    injectUserIntoUI(user);

  } catch (err) {
    console.error("User load failed:", err.message);
  }
}


function injectUserIntoUI(user) {
  if (!user) return;

  // Sidebar name
  const nameEl = document.querySelector(".user-mini__name");
  if (nameEl) {
    nameEl.textContent =
      `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
  }

  // Sidebar email
  const subEl = document.querySelector(".user-mini__sub");
  if (subEl) {
    subEl.textContent = user.email || "";
  }

  // Sidebar avatar
  const sidebarAvatar = document.querySelector(".user-mini__avatar");
  if (sidebarAvatar && user.avatar) {
    sidebarAvatar.src = user.avatar;
  }

  // Topbar avatar
  const topbarAvatar = document.querySelector(".avatar-btn img");
  if (topbarAvatar && user.avatar) {
    topbarAvatar.src = user.avatar;
  }
}

loadLoggedInUser();



const trackingInput = document.getElementById("trackingInput");
const trackBtn = document.getElementById("trackBtn");
const notFoundMsg = document.getElementById("notFoundMsg");

const reportDetailsCard = document.getElementById("reportDetailsCard");
const photosCard = document.getElementById("photosCard");

const statusPill = document.getElementById("statusPill");
const priorityPill = document.getElementById("priorityPill");
const statusPill2 = document.getElementById("statusPill2");
const priorityPill2 = document.getElementById("priorityPill2");

const etaText = document.getElementById("etaText");

const timeline = document.getElementById("timeline");
const photosGrid = document.getElementById("photosGrid");

const locTitle = document.getElementById("locTitle");
const locAddress = document.getElementById("locAddress");
const submittedDate = document.getElementById("submittedDate");

// Hide cards initially
reportDetailsCard.style.display = "none";
photosCard.style.display = "none";

// =============================
// Helpers
// =============================

function formatDate(date) {
  return new Date(date).toLocaleString();
}

function formatStatus(status) {
  return status.replace("_", " ");
}

function estimateETA(status) {
  switch (status) {
    case "PENDING":
      return "48 - 72 hours";
    case "ASSIGNED":
      return "24 - 48 hours";
    case "IN_PROGRESS":
      return "12 - 24 hours";
    case "COMPLETED":
      return "Completed";
    default:
      return "Pending";
  }
}

// =============================
// Timeline Builder
// =============================

function buildTimeline(report) {
  timeline.innerHTML = "";

  const steps = [
    {
      label: `Report Received: ${report.category}`,
      show: true,
      time: report.createdAt,
      desc: "Your report was successfully submitted.",
    },
    {
      label: "Assigned to Worker",
      show: report.status !== "PENDING",
      time: report.updatedAt || report.updatedAt,
      desc: report.assignedTo ? `Field Worker: ${report.assignedTo.email}` : "",
    },
    {
      label: "Work Started",
      show: ["IN_PROGRESS", "COMPLETED"].includes(report.status),
      desc: "Worker is resolving the issue.",
    },
    {
      label: "Completed",
      show: report.status === "COMPLETED",
      desc: "The worker has successfully resolved the issue",
    },
  ];

  steps.forEach((step) => {
    if (!step.show) return;

    const item = document.createElement("div");
    item.className = "timeline-item";

    item.innerHTML = `
      <div class="timeline-icon">✔</div>
      <div class="timeline-content">
        <h4>${step.label}</h4>
        <p class="timeline-time">${step.time ? formatDate(step.time) : ""}</p>
        <p>${step.desc || ""}</p>
      </div>
    `;

    timeline.appendChild(item);
  });
}

// =============================
// Photos Builder
// =============================

function buildPhotos(images) {
  photosGrid.innerHTML = "";

  if (!images || images.length === 0) {
    photosGrid.innerHTML = "<p>No photos uploaded</p>";
    return;
  }

  images.forEach((url) => {
    const img = document.createElement("img");
    img.src = url;
    img.className = "photo";
    img.loading = "lazy";

    photosGrid.appendChild(img);
  });
}

// =============================
// Populate UI
// =============================

function renderReport(report) {
  // Show cards
  reportDetailsCard.style.display = "block";
  photosCard.style.display = "block";

  // Status + priority
  const statusText = formatStatus(report.status);

  statusPill.textContent = statusText;
  statusPill2.textContent = statusText;

  priorityPill.textContent = report.priority;
  priorityPill2.textContent = report.priority;

  // ETA
  etaText.textContent = estimateETA(report.status);

  // Location
  locTitle.textContent = `${report.lga}, ${report.state}`;
  locAddress.textContent = report.address;
  submittedDate.textContent = formatDate(report.createdAt);

  // Timeline
  buildTimeline(report);

  // Photos
  buildPhotos(report.images);
}

// =============================
// Fetch Report
// =============================

async function fetchReport(trackingId) {
  try {
    notFoundMsg.textContent = "";

    const res = await fetch(`${API}/reports/track/${trackingId}`, {
      headers: {
        ...authHeader,
      },
    });

    if (!res.ok) {
      throw new Error("Report not found");
    }

    const report = await res.json();

    renderReport(report);
  } catch (err) {
    reportDetailsCard.style.display = "none";
    photosCard.style.display = "none";

    notFoundMsg.textContent = "Tracking ID not found.";
  }
}

// =============================
// Button Click
// =============================

trackBtn.addEventListener("click", () => {
  const trackingId = trackingInput.value.trim();

  if (!trackingId) {
    notFoundMsg.textContent = "Enter tracking ID";
    return;
  }

  fetchReport(trackingId);
});

// =============================
// Auto Load From URL
// =============================

const urlParams = new URLSearchParams(window.location.search);
const trackingIdFromUrl = urlParams.get("trackingId");

if (trackingIdFromUrl) {
  trackingInput.value = trackingIdFromUrl;
  fetchReport(trackingIdFromUrl);
}
