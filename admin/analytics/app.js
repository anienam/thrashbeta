

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
























/* =========================
   TrashBeta • Admin Analytics
   Matches Admin Dashboard nav/layout
   ========================= */

const $ = (q, el = document) => el.querySelector(q);

/* ---------- Sidebar (mobile) ---------- */
const sidebar = $("#sidebar");
const overlay = $("#overlay");
const menuBtn = $("#menuBtn");

function openSidebar() {
  sidebar.classList.add("is-open");
  overlay.hidden = false;
}
function closeSidebar() {
  sidebar.classList.remove("is-open");
  overlay.hidden = true;
}

menuBtn?.addEventListener("click", () => {
  sidebar.classList.contains("is-open") ? closeSidebar() : openSidebar();
});
overlay?.addEventListener("click", closeSidebar);

/* ---------- Mini bars (top left card) ---------- */
const miniBars = $("#miniBars");
const vals = [30, 42, 55, 66, 60, 78, 92]; // visual approximation
const max = Math.max(...vals);

miniBars.innerHTML = vals
  .map((v, idx) => {
    const h = Math.max(14, Math.round((v / max) * 100));
    const cls =
      idx === 2
        ? "mbar dark"
        : idx >= 5
          ? "mbar strong"
          : idx >= 3
            ? "mbar mid"
            : "mbar";
    return `<div class="${cls}" style="height:${h}%"></div>`;
  })
  .join("");

/* ---------- Response time by type ---------- */
const rt = [
  { name: "Overflowing bins", time: "45m", pct: 30, color: "green" },
  { name: "Missed Collections", time: "2h 15m", pct: 55, color: "orange" },
  { name: "Illegal Dumping", time: "4h 40m", pct: 88, color: "gray" },
  { name: "Hazardous Waste", time: "18m", pct: 14, color: "red" },
];

const rtList = $("#rtList");
rtList.innerHTML = rt
  .map(
    (r) => `
  <div class="rt">
    <div>
      <div class="rt__name">${r.name}</div>
      <div class="track">
        <div class="fill ${r.color}" style="width:${r.pct}%"></div>
      </div>
    </div>
    <div class="rt__time ${r.color}">${r.time}</div>
  </div>
`,
  )
  .join("");
