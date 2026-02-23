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


// DOM elements
const statsContainer = document.getElementById('stats');
const tbody = document.getElementById('tbody');
const typeBtn = document.getElementById('typeBtn');
const typeDrop = document.getElementById('typeDrop');

// State
let users = [];
let filteredUsers = [];
let selectedRole = 'All';

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
loadUserProfile();

/* =========================================================
   NOTIFICATION PREFS
========================================================= */
const notifPanel = document.querySelector('.content [data-pane="notifications"] .stack');
let notifEmail, notifSMS, saveNotifBtn;

if (notifPanel) {
  // Select first two checkboxes inside the stack
  const checkboxes = notifPanel.querySelectorAll('input[type="checkbox"]');
  notifEmail = checkboxes[0];
  notifSMS = checkboxes[1];

  // Create Save button if not already present
  saveNotifBtn = document.createElement('button');
  saveNotifBtn.textContent = "Save Notifications";
  saveNotifBtn.className = "btn";
  notifPanel.appendChild(saveNotifBtn);

  saveNotifBtn.addEventListener('click', async () => {
    let channel = null;
    if (notifEmail.checked && notifSMS.checked) channel = "BOTH";
    else if (notifEmail.checked) channel = "EMAIL";
    else if (notifSMS.checked) channel = "SMS";

    try {
      const res = await fetch(`${API}/auth/profile/notify`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ notificationChannel: channel })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("Notification preferences updated to: " + channel);
    } catch (err) {
      alert("Failed to update: " + err.message);
    }
  });

  // Load existing notification preferences
  async function loadNotifPrefs() {
    try {
      const res = await fetch(`${API}/auth/me`, { headers: authHeaders() });
      const user = await res.json();
      const pref = user.profile?.notificationChannel || "EMAIL";
      notifEmail.checked = pref === "EMAIL" || pref === "BOTH";
      notifSMS.checked = pref === "SMS" || pref === "BOTH";
    } catch (err) {
      console.error("Failed to load notification prefs:", err);
    }
  }
  loadNotifPrefs();
}

/* =========================================================
   FETCH API KEY + WEBHOOK
========================================================= */
const apiInput = document.getElementById('apiKey');
const webhookInput = document.getElementById('webhook');
const webhookSaveBtn = document.createElement('button');
webhookSaveBtn.textContent = "Save Webhook";
webhookSaveBtn.className = "btn";
webhookInput?.parentNode.appendChild(webhookSaveBtn);

async function loadIntegration() {
  try {
    const res = await fetch(`${API}/integration`, { headers: authHeaders() });
    if (!res.ok) throw new Error("Failed to load integration");
    const data = await res.json();

    apiInput.value = data.apiKey || "••••••••••••••••";
    webhookInput.value = data.webhookUrl || "";
  } catch (err) {
    console.error("Error loading integration:", err.message);
    apiInput.value = "••••••••••••••••";
    webhookInput.value = "";
  }
}
loadIntegration();

webhookSaveBtn.addEventListener('click', async () => {
  try {
    const res = await fetch(`${API}/integration/webhook`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ webhookUrl: webhookInput.value })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    alert("Webhook updated successfully");
  } catch (err) {
    alert("Failed to update webhook: " + err.message);
  }
});




























/* =========================================================
   SIDEBAR & TABS
========================================================= */
const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => [...el.querySelectorAll(q, el)];

const sidebar = $("#sidebar");
const overlay = $("#overlay");
const menuBtn = $("#menuBtn");

function openSidebar() {
  sidebar?.classList.add("is-open");
  if (overlay) overlay.hidden = false;
}
function closeSidebar() {
  sidebar?.classList.remove("is-open");
  if (overlay) overlay.hidden = true;
}

menuBtn?.addEventListener("click", () => sidebar?.classList.contains("is-open") ? closeSidebar() : openSidebar());
overlay?.addEventListener("click", closeSidebar);

const tabBtns = $$(".subnav__item");
const panes = $$(".content [data-pane]");

function setTab(tab) {
  tabBtns.forEach(b => b.classList.toggle("is-active", b.dataset.tab === tab));
  panes.forEach(p => p.classList.toggle("is-active", p.dataset.pane === tab));
}

tabBtns.forEach(btn => btn.addEventListener("click", () => setTab(btn.dataset.tab)));
setTab("general");

/* =========================================================
   COPY API KEY
========================================================= */
const copyBtn = $("#copyBtn");
copyBtn?.addEventListener("click", async () => {
  const apiKey = $("#apiKey");
  const value = apiKey?.value || "";
  try {
    await navigator.clipboard.writeText(value);
    const old = copyBtn.textContent;
    copyBtn.textContent = "Copied";
    setTimeout(() => copyBtn.textContent = old, 1200);
  } catch {
    apiKey?.select?.();
    document.execCommand?.("copy");
    copyBtn.textContent = "Copied";
    setTimeout(() => copyBtn.textContent = "Copy", 1200);
  }
});
