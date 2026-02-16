// =============================
// CONFIG
// =============================
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

if (!token || !role || (role !== "staff" && role !== "admin")) {
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
// TOAST
// =============================
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.hidden = false;

  setTimeout(() => {
    toast.hidden = true;
  }, 3000);
}

// =============================
// PROFILE LOAD
// =============================
async function loadWorkerProfile() {
  try {
    const res = await fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Failed to fetch profile");

    const user = await res.json();

    document.querySelector(".profile-name").textContent =
      `${user.firstName} ${user.lastName}`;

    const avatarImg = document.getElementById("profileAvatar");
    const avatarInitials = document.getElementById("avatarInitials");

    if (user.avatar) {
      avatarImg.src = user.avatar;
      avatarImg.style.display = "block";
      avatarInitials.style.display = "none";
    } else {
      avatarInitials.textContent =
        `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`;
      avatarImg.style.display = "none";
      avatarInitials.style.display = "block";
    }

    // Load notification channel
    setNotificationUI(user.notificationChannel);

  } catch (err) {
    showToast("Failed to load profile");
  }
}

// =============================
// NOTIFICATION SETTINGS
// =============================
const emailToggle = document.querySelector("label[aria-label='Email Alerts'] input");
const smsToggle = document.querySelector("label[aria-label='SMS Gateways'] input");

function setNotificationUI(channel) {
  if (channel === "BOTH") {
    emailToggle.checked = true;
    smsToggle.checked = true;
  } else if (channel === "SMS") {
    emailToggle.checked = false;
    smsToggle.checked = true;
  } else {
    emailToggle.checked = true;
    smsToggle.checked = false;
  }
}

async function saveNotificationPreference() {
  let notificationChannel;

  if (emailToggle.checked && smsToggle.checked) {
    notificationChannel = "BOTH";
  } else if (emailToggle.checked) {
    notificationChannel = "EMAIL";
  } else if (smsToggle.checked) {
    notificationChannel = "SMS";
  } else {
    showToast("Select at least one notification method");
    return;
  }


  try {
    const res = await fetch(`${API}/auth/user/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ notificationChannel })
    });

    if (!res.ok) throw new Error();

    showToast("Notification preference updated");
  } catch (err) {
    showToast("Failed to update notification");
  }
}

emailToggle.addEventListener("change", saveNotificationPreference);
smsToggle.addEventListener("change", saveNotificationPreference);

// =============================
// INTEGRATION LOAD
// =============================
async function loadIntegration() {
  try {
    const res = await fetch(`${API}/integration`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error();

    const data = await res.json();

    document.getElementById("apiKey").value = data.apiKey;

    if (data.webhookUrl) {
      document.querySelector("input[type='url']").value = data.webhookUrl;
    }

  } catch (err) {
    showToast("Failed to load integration");
  }
}

// =============================
// WEBHOOK UPDATE
// =============================
const webhookInput = document.querySelector("input[type='url']");

webhookInput.addEventListener("blur", async () => {
  try {
    const res = await fetch(`${API}/integration/webhook`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ webhookUrl: webhookInput.value })
    });

    if (!res.ok) throw new Error();

    showToast("Webhook updated successfully");
  } catch (err) {
    showToast("Failed to update webhook");
  }
});

// =============================
// COPY API KEY
// =============================
document.getElementById("copyKeyBtn").addEventListener("click", () => {
  const apiKeyInput = document.getElementById("apiKey");
  apiKeyInput.select();
  document.execCommand("copy");
  showToast("API key copied");
});

// =============================
// SETTINGS TAB SWITCHING
// =============================
document.querySelectorAll(".snavItem").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".snavItem").forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");

    const target = btn.dataset.target;

    document.querySelectorAll(".card").forEach(card => {
      card.style.display = "none";
    });

    document.getElementById(target).style.display = "block";
  });
});

// =============================
// INIT
// =============================
loadWorkerProfile();
loadIntegration();
