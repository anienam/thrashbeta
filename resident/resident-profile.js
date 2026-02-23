//resident-profile.js

//const API = 'http://localhost:5000/api/v1';   // Development

const API = "https://trashbeta.onrender.com/api/v1"; //Production

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
    const payload = JSON.parse(atob(token.split(".")[1]));
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

// DOM elements
const displayName = document.getElementById("displayName");
const displayEmail = document.getElementById("displayEmail");
const memberSince = document.getElementById("memberSince");
const profileAvatar = document.getElementById("profileAvatar");
const topAvatar = document.getElementById("topAvatar");

const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const addressInput = document.getElementById("address");
const lgaInput = document.getElementById("lga");
const profileForm = document.getElementById("profileForm");
const photoInput = document.getElementById("photoInput");
const changePhotoBtn = document.getElementById("changePhotoBtn");
const saveMsg = document.getElementById("saveMsg");
const cancelBtn = document.getElementById("cancelBtn");
const sidebarName = document.getElementById("sidebarName");
const sidebarEmail = document.getElementById("sidebarEmail");
const sidebarAvatar = document.getElementById("sidebarAvatar");

let selectedPhoto = null;

// Fetch and display profile
async function loadProfile() {
  try {
    const res = await fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = await res.json();

    fullNameInput.value = `${user.firstName || ""} ${user.lastName || ""}`;
    emailInput.value = user.email || "";
    phoneInput.value = user.phone || "";
    addressInput.value = user.address || "";
    lgaInput.value = user.cityLGA || "";


    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

    displayName.textContent = fullName;
    displayEmail.textContent = user.email;

    // Update sidebar
    sidebarName.textContent = fullName;
    sidebarEmail.textContent = user.email;

    memberSince.textContent = `Member since ${new Date(user.createdAt).toLocaleDateString()}`;

    const avatarUrl = user.avatar || "/assets/images/Avatar profile photo5.png";
    profileAvatar.src = avatarUrl;
    topAvatar.src = avatarUrl;
    if (sidebarAvatar) sidebarAvatar.src = avatarUrl;
  } catch (err) {
    console.error("Error loading profile:", err);
  }
}

loadProfile();

// Handle avatar selection
changePhotoBtn.addEventListener("click", () => photoInput.click());
photoInput.addEventListener("change", () => {
  selectedPhoto = photoInput.files[0];
  if (selectedPhoto) profileAvatar.src = URL.createObjectURL(selectedPhoto);
});

// Update profile
profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    saveMsg.textContent = "Saving...";

    const fullName = fullNameInput.value.trim();
    const [firstName, ...lastParts] = fullName.split(" ");
    const lastName = lastParts.join(" ");

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("phone", phoneInput.value);
    formData.append("address", addressInput.value);
    formData.append("cityLGA", lgaInput.value);
    if (selectedPhoto) formData.append("avatar", selectedPhoto);

    const res = await fetch(`${API}/auth/user/profile`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update profile");

    saveMsg.textContent = "Profile updated successfully!";
    selectedPhoto = null;
    loadProfile();
  } catch (err) {
    saveMsg.textContent = err.message;
  }
});

// Cancel button reloads profile
cancelBtn.addEventListener("click", loadProfile);

(() => {
  const $ = (q) => document.querySelector(q);

  const tabs = document.querySelectorAll(".tab-pill");
  const panels = document.querySelectorAll(".panel");

  // Tabs
  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabs.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      const tab = btn.dataset.tab;
      panels.forEach((p) =>
        p.classList.toggle("is-active", p.dataset.panel === tab),
      );
    });
  });
})();

// ===== Notification Settings (match screenshot) =====
const NOTIFY_KEY = "resident_profile_notifications";

const notifyEmail = document.getElementById("notifyEmail");
const notifySMS = document.getElementById("notifySMS");
const notifyReportUpdates = document.getElementById("notifyReportUpdates");
const notifyPickupReminders = document.getElementById("notifyPickupReminders");
const notifyCommunityNews = document.getElementById("notifyCommunityNews");

const notifyCancelBtn = document.getElementById("notifyCancelBtn");
const notifySaveBtn = document.getElementById("notifySaveBtn");
const notifyMsg = document.getElementById("notifyMsg");

function getNotifySettings() {
  try {
    return (
      JSON.parse(localStorage.getItem(NOTIFY_KEY)) || {
        email: true,
        sms: false,
        reportUpdates: true,
        pickupReminders: false,
        communityNews: true,
      }
    );
  } catch {
    return {
      email: true,
      sms: false,
      reportUpdates: true,
      pickupReminders: false,
      communityNews: true,
    };
  }
}

function setNotifyUI(s) {
  if (!notifyEmail) return;
  notifyEmail.checked = !!s.email;
  notifySMS.checked = !!s.sms;
  notifyReportUpdates.checked = !!s.reportUpdates;
  notifyPickupReminders.checked = !!s.pickupReminders;
  notifyCommunityNews.checked = !!s.communityNews;
}

function saveNotifySettings(s) {
  localStorage.setItem(NOTIFY_KEY, JSON.stringify(s));
}

function toastNotify(text, ok = true) {
  if (!notifyMsg) return;
  notifyMsg.style.color = ok ? "#2f7d32" : "#b91c1c";
  notifyMsg.textContent = text;
  setTimeout(() => (notifyMsg.textContent = ""), 2200);
}

if (notifySaveBtn) {
  // init UI
  setNotifyUI(getNotifySettings());

  notifySaveBtn.addEventListener("click", () => {
    const next = {
      email: notifyEmail.checked,
      sms: notifySMS.checked,
      reportUpdates: notifyReportUpdates.checked,
      pickupReminders: notifyPickupReminders.checked,
      communityNews: notifyCommunityNews.checked,
    };
    saveNotifySettings(next);
    toastNotify("Preferences saved.");
  });

  notifyCancelBtn.addEventListener("click", () => {
    setNotifyUI(getNotifySettings());
    if (notifyMsg) notifyMsg.textContent = "";
  });
}

// ===== Account Actions (match screenshot) =====
const accountMsg = document.getElementById("accountMsg");
const downloadDataBtn = document.getElementById("downloadDataBtn");
const deleteAccountBtn = document.getElementById("deleteAccountBtn");
const logoutBtn = document.getElementById("logoutBtn");

// modal
const confirmModal = document.getElementById("confirmModal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalCancel = document.getElementById("modalCancel");
const modalConfirm = document.getElementById("modalConfirm");

let pendingAction = null;

function toastAccount(text, ok = true) {
  if (!accountMsg) return;
  accountMsg.style.color = ok ? "#2f7d32" : "#b91c1c";
  accountMsg.textContent = text;
  setTimeout(() => (accountMsg.textContent = ""), 2500);
}

function openModal(title, desc, actionFn) {
  if (!confirmModal) return;
  modalTitle.textContent = title;
  modalDesc.textContent = desc;
  pendingAction = actionFn;
  confirmModal.hidden = false;
}

function closeModal() {
  if (!confirmModal) return;
  confirmModal.hidden = true;
  pendingAction = null;
}

if (modalCancel) modalCancel.addEventListener("click", closeModal);
if (confirmModal) {
  confirmModal.addEventListener("click", (e) => {
    if (e.target === confirmModal) closeModal();
  });
}
if (modalConfirm) {
  modalConfirm.addEventListener("click", () => {
    if (typeof pendingAction === "function") pendingAction();
    closeModal();
  });
}

// Download my data
if (downloadDataBtn) {
  downloadDataBtn.addEventListener("click", () => {
    const data = {
      exportedAt: new Date().toISOString(),
      profile: (() => {
        try {
          return JSON.parse(localStorage.getItem("resident_profile")) || {};
        } catch {
          return {};
        }
      })(),
      notifications: (() => {
        try {
          return (
            JSON.parse(
              localStorage.getItem("resident_profile_notifications"),
            ) || {}
          );
        } catch {
          return {};
        }
      })(),
      reports: (() => {
        // only if you stored reports; otherwise empty
        try {
          return JSON.parse(localStorage.getItem("resident_reports")) || [];
        } catch {
          return [];
        }
      })(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "trashbeta-my-data.json";
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
    toastAccount("Your data download is ready.");
  });
}

// Delete account
if (deleteAccountBtn) {
  deleteAccountBtn.addEventListener("click", () => {
    openModal(
      "Delete Account",
      "This will permanently remove your profile and saved data on this device. Continue?",
      () => {
        localStorage.removeItem("resident_profile");
        localStorage.removeItem("resident_profile_notifications");
        localStorage.removeItem("resident_reports");
        toastAccount("Account deleted (demo).", false);

        // Optional redirect:
        // window.location.href = "login.html";
      },
    );
  });
}

// Logout
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    openModal("Logout", "Are you sure you want to logout?", () => {
      toastAccount("Logged out (demo).");
      // Optional redirect:
      // window.location.href = "login.html";
    });
  });
}

