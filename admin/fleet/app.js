

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

if (!token || !role || ( role !== "admin")) {
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
   TrashBeta • Fleet Management
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

/* ---------- KPI cards ---------- */
const stats = [
  { title: "Active Fleets", value: "12", meta: "+12%", icon: "🚚" },
  { title: "Average Fuel Efficiency", value: "14.2", meta: "+5%", icon: "📈" },
  {
    title: "Total Tonage Today",
    value: "28.4",
    meta: "Goals",
    icon: "📦",
    right: "+12%",
  },
  {
    title: "Incident Alerts",
    value: "0.2",
    meta: "Vehicle Maintenance",
    icon: "⚙️",
  },
];

$("#stats").innerHTML = stats
  .map(
    (s) => `
  <article class="stat">
    <div class="stat__top">
      <div class="stat__title">${s.title}</div>
      <div style="display:flex;gap:10px;align-items:center;">
        ${s.right ? `<span style="color:#6b7280;font-weight:900;">${s.right}</span>` : ""}
        <div class="stat__icon" aria-hidden="true">${s.icon}</div>
      </div>
    </div>
    <div class="stat__value">${s.value}</div>
    <div class="stat__meta">
      <span>${s.meta}</span>
      <span class="spark" aria-hidden="true">↗</span>
    </div>
  </article>
`,
  )
  .join("");

/* ---------- Table ---------- */
const rows = [
  {
    id: "#TR-8821",
    driver: "Team Jenna",
    route: "Ikeja",
    load: "",
    status: "Pending",
    date: "23/07/2025",
  },
  {
    id: "#TR-8820",
    driver: "Team Kris",
    route: "Marina",
    load: "",
    status: "Resolved",
    date: "23/07/2025",
  },
  {
    id: "#TR-8819",
    driver: "Team Nas",
    route: "Ikoyi",
    load: "",
    status: "In Progress",
    date: "23/07/2025",
  },
  {
    id: "#TR-8818",
    driver: "Team Nas",
    route: "Ibeju Lekki",
    load: "",
    status: "Resolved",
    date: "23/07/2025",
  },
  {
    id: "#TR-8817",
    driver: "Team Nas",
    route: "Surulere",
    load: "",
    status: "Resolved",
    date: "23/07/2025",
  },
  {
    id: "#TR-8816",
    driver: "Team Kris",
    route: "Yaba",
    load: "",
    status: "In Progress",
    date: "23/07/2025",
  },
  {
    id: "#TR-8815",
    driver: "Team Nas",
    route: "Ketu",
    load: "",
    status: "In Progress",
    date: "23/07/2025",
  },
  {
    id: "#TR-8814",
    driver: "Team Jenna",
    route: "Ebute Metta",
    load: "",
    status: "In Progress",
    date: "23/07/2025",
  },
  {
    id: "#TR-8813",
    driver: "Team Jenna",
    route: "Ajah",
    load: "",
    status: "Resolved",
    date: "23/07/2025",
  },
  {
    id: "#TR-8812",
    driver: "Team Kris",
    route: "Badagry",
    load: "",
    status: "Pending",
    date: "23/07/2025",
  },
];

function pillClass(status) {
  if (status === "Pending") return "pill--pending";
  if (status === "Resolved") return "pill--resolved";
  return "pill--progress";
}

$("#tbody").innerHTML = rows
  .map(
    (r) => `
  <tr>
    <td><strong>${r.id}</strong></td>
    <td style="color:#4b5563;font-weight:800;">${r.driver}</td>
    <td style="color:#4b5563;font-weight:800;">${r.route}</td>
    <td style="color:#9ca3af;font-weight:800;">${r.load || ""}</td>
    <td>
      <span class="pill ${pillClass(r.status)}">${r.status}</span>
      <span style="float:right;color:#111827;font-weight:900;">${r.date}</span>
    </td>
  </tr>
`,
  )
  .join("");

/* ---------- Route completion progress ---------- */
const routes = [
  { name: "Downtime Commercial (Sector 1)", pct: 92, color: "green" },
  { name: "Highland Residential (Sector 2)", pct: 45, color: "green" },
  { name: "Industrial Zone B (Sector 3)", pct: 15, color: "orange" },
];

const routesEl = $("#routes");
routesEl.innerHTML = routes
  .map(
    (r) => `
  <div class="route">
    <div>
      <div class="route__title">${r.name}</div>
      <div class="track">
        <div class="fill fill--${r.color}" style="width:${r.pct}%"></div>
      </div>
    </div>
    <div class="route__pct" style="color:${r.color === "orange" ? "#f97316" : "#0b3d16"}">
      ${r.pct}%
    </div>
  </div>
`,
  )
  .join("");



















