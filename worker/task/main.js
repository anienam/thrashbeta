//main.js

//const API = 'http://localhost:5000/api/v1'; // Development
const API = 'https://trashbeta.onrender.com/api/v1'; // Production

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

if (!token || !role || (role !== "staff" && role !== "admin")) {
  clearUserSession();
  window.location.href = "../../auth/login.html";
} else {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = payload.exp * 1000 - Date.now();

    if (expiryTime <= 0) {
      alert("Your session has expired. Please log in again.");
      clearUserSession();
      window.location.href = "../../auth/login.html";
    } else {
      setTimeout(() => {
        alert("Your session has expired. Please log in again.");
        clearUserSession();
        window.location.href = "../../auth/login.html";
      }, expiryTime);
    }
  } catch {
    alert("Invalid session. Please log in again.");
    clearUserSession();
    window.location.href = "../../auth/login.html";
  }
}

// ===== DOM ELEMENTS =====
const reportContainer = document.getElementById("reportContainer");
const trackingInput = document.getElementById("trackingSearch");
const searchBtn = document.getElementById("searchReportBtn");
const addressEl = document.getElementById("taskAddress");
const locationEl = document.getElementById("taskLocation");
const wasteTypeEl = document.getElementById("wasteType");
const reporterEl = document.getElementById("reporter");
const descriptionEl = document.getElementById("description");
const photoRow = document.getElementById("photoRow");
const toastEl = document.getElementById("toast");
const copyAddressBtn = document.getElementById("copyAddressBtn");

const statusSelect = document.getElementById("statusSelect");
const markCompleteBtn = document.getElementById("markCompleteBtn");

// ===== TOAST =====
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.hidden = false;
  setTimeout(() => toastEl.hidden = true, 3000);
}

// ===== SEARCH REPORT =====
searchBtn.onclick = fetchReport;
trackingInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") fetchReport();
});

async function fetchReport() {
  const trackingId = trackingInput.value.trim();
  if (!trackingId) return showToast("Enter Tracking ID");

  try {
    const res = await fetch(`${API}/reports/track/${trackingId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (!res.ok) return showToast(data.message || "Report not found");

    populateReport(data);
    reportContainer.hidden = false;
    showToast("Report loaded");
  } catch (err) {
    console.error(err);
    showToast("Error loading report");
  }
}

function populateReport(report) {
  addressEl.textContent = report.address || "--";
  locationEl.textContent = `${report.lga || "--"}, ${report.state || "--"}`;
  wasteTypeEl.textContent = report.category || "--";
  reporterEl.textContent = report.contactDetails?.name || "Unknown Reporter";
  descriptionEl.textContent = report.description || "No instructions provided";

  loadImages(report.images || []);
  updateMap(report);

  // Set dropdown to current status
  if (statusSelect) statusSelect.value = report.status || "in_progress";
}

function loadImages(images) {
  photoRow.innerHTML = "";
  if (!images.length) {
    photoRow.innerHTML = "<p>No evidence photos uploaded</p>";
    return;
  }
  images.forEach((img) => {
    const div = document.createElement("div");
    div.className = "photo photo--img";
    div.innerHTML = `<img src="${img}" alt="Evidence" style="width:100%;height:100%;object-fit:cover;">`;
    photoRow.appendChild(div);
  });
}

function updateMap(report) {
  const mapFrame = document.querySelector(".map__bg iframe");
  if (!mapFrame || !report.address) return;
  const encoded = encodeURIComponent(`${report.address}, ${report.lga}, ${report.state}`);
  mapFrame.src = `https://www.google.com/maps?q=${encoded}&output=embed`;
}

// ===== COPY ADDRESS =====
copyAddressBtn.onclick = () => {
  if (!addressEl.textContent || addressEl.textContent === "--") return;
  navigator.clipboard.writeText(addressEl.textContent);
  showToast("Address copied");
};

// ===== SIDEBAR TOGGLE =====
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
document.getElementById("sidebarOpen").onclick = () => {
  sidebar.classList.add("is-open");
  overlay.hidden = false;
};
overlay.onclick = () => {
  sidebar.classList.remove("is-open");
  overlay.hidden = true;
};

// ===== BACK BUTTON =====
document.getElementById("backBtn").onclick = () => window.history.back();

// ===== PHOTO UPLOAD =====
const addPhotoBtn = document.getElementById("addPhotoBtn");
const photoInput = document.getElementById("photoInput");
const uploadTile = document.getElementById("uploadTile");
[addPhotoBtn, uploadTile].forEach(btn => {
  if (btn) btn.onclick = () => photoInput.click();
});

// ===== MANAGE TASK (UPDATE STATUS) =====
// Dropdown change
if (statusSelect) {
  statusSelect.addEventListener("change", async () => {
    const newStatus = statusSelect.value;
    await updateReportStatus(newStatus);
  });
}

// Mark as completed button
if (markCompleteBtn) {
  markCompleteBtn.addEventListener("click", async () => {
    if (!statusSelect) return;
    statusSelect.value = "COMPLETED"; // must match allowed status
    await updateReportStatus("COMPLETED");
  });
}

// Dropdown change
if (statusSelect) {
  statusSelect.addEventListener("change", async () => {
    const newStatus = statusSelect.value;
    const allowedStatuses = ["PENDING","ASSIGNED","IN_PROGRESS","COMPLETED","CANCELLED"];

    if (!allowedStatuses.includes(newStatus)) {
      showToast("Invalid status selected");
      return;
    }

    await updateReportStatus(newStatus);
  });
}

// Function to update status via API
async function updateReportStatus(status) {
  const trackingId = trackingInput.value.trim();
  if (!trackingId) return showToast("No report selected");

  try {
    const res = await fetch(`${API}/reports/tracking/${trackingId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.message || "Failed to update status");
      return;
    }

    showToast(`Report status updated to "${status}"`);
    fetchReport(); // refresh report info
  } catch (err) {
    console.error(err);
    showToast("Error updating status");
  }
}
