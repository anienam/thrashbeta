/* =========================
   TrashBeta • Admin Dashboard
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
  const isOpen = sidebar.classList.contains("is-open");
  isOpen ? closeSidebar() : openSidebar();
});
overlay?.addEventListener("click", closeSidebar);

/* ---------- Stats cards ---------- */
const stats = [
  { title: "Total Reports", value: "1,240", meta: "+12%", icon: "🗓️" },
  { title: "Resolved Issues", value: "85%", meta: "+5%", icon: "✅" },
  {
    title: "Active Fleets",
    value: "15",
    meta: "New alerts available",
    icon: "🚚",
  },
  {
    title: "Response Time Av",
    value: "15",
    meta: "New alerts available",
    icon: "🕒",
  },
];

const statsEl = $("#stats");
statsEl.innerHTML = stats
  .map(
    (s) => `
  <article class="stat">
    <div class="stat__top">
      <div class="stat__title">${s.title}</div>
      <div class="stat__icon" aria-hidden="true">${s.icon}</div>
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

/* ---------- Donut chart (SVG segments) ---------- */
const donutData = [
  { label: "Organic", pct: 32, color: "#00c853" },
  { label: "Recyclable", pct: 24, color: "#98fca5" },
  { label: "Waste", pct: 21, color: "#0b3d16" },
  { label: "Non", pct: 18, color: "#ff4d4d" },
  { label: "Inorganic", pct: 15, color: "#b45309" },
  { label: "Others", pct: 11, color: "#6b7280" },
];

const r = 44;
const C = 2 * Math.PI * r;
let offset = 0;

const segmentsG = $("#donutSegments");
segmentsG.innerHTML = donutData
  .map((d) => {
    const dash = (d.pct / 100) * C;
    const seg = `
    <circle
      cx="60" cy="60" r="${r}"
      fill="none"
      stroke="${d.color}"
      stroke-width="14"
      stroke-linecap="butt"
      stroke-dasharray="${dash} ${C - dash}"
      stroke-dashoffset="${-offset}"
    ></circle>
  `;
    offset += dash;
    return seg;
  })
  .join("");

/* Legend */
const legendList = $("#legendList");
legendList.innerHTML = donutData
  .map(
    (d) => `
  <div class="leg">
    <span class="dot" style="background:${d.color}"></span>
    <span>${d.label}</span>
    <span style="color:#111827;font-weight:900;">${d.pct}%</span>
  </div>
`,
  )
  .join("");

/* ---------- Table ---------- */
const rows = [
  {
    id: "#TR-8821",
    type: "Missed PickUp",
    typeKey: "missed",
    loc: "Ikeja",
    status: "Pending",
    date: "23/07/2025",
  },
  {
    id: "#TR-8820",
    type: "Trashed",
    typeKey: "trashed",
    loc: "Marina",
    status: "Resolved",
    date: "23/07/2025",
  },
  {
    id: "#TR-8819",
    type: "Overflowing Bin",
    typeKey: "overflow",
    loc: "Ikoyi",
    status: "In Progress",
    date: "23/07/2025",
  },
  {
    id: "#TR-8818",
    type: "Illegal Dumping",
    typeKey: "illegal",
    loc: "Ibeju Lekki",
    status: "Resolved",
    date: "23/07/2025",
  },
  {
    id: "#TR-8817",
    type: "Missed PickUp",
    typeKey: "missed",
    loc: "Surulere",
    status: "Resolved",
    date: "23/07/2025",
  },
  {
    id: "#TR-8816",
    type: "Illegal Dumping",
    typeKey: "illegal",
    loc: "Yaba",
    status: "In Progress",
    date: "23/07/2025",
  },
  {
    id: "#TR-8815",
    type: "Illegal Dumping",
    typeKey: "illegal",
    loc: "Ketu",
    status: "In Progress",
    date: "23/07/2025",
  },
  {
    id: "#TR-8814",
    type: "Overflowing Bin",
    typeKey: "overflow",
    loc: "Ebute Metta",
    status: "In Progress",
    date: "23/07/2025",
  },
  {
    id: "#TR-8813",
    type: "Trashed",
    typeKey: "trashed",
    loc: "Ajah",
    status: "Resolved",
    date: "23/07/2025",
  },
  {
    id: "#TR-8812",
    type: "Trashed",
    typeKey: "trashed",
    loc: "Badagry",
    status: "Pending",
    date: "23/07/2025",
  },
  {
    id: "#TR-8811",
    type: "Trashed",
    typeKey: "trashed",
    loc: "Iyana-Ipaja",
    status: "Pending",
    date: "23/07/2025",
  },
];

function pillClass(status) {
  if (status === "Pending") return "pill--pending";
  if (status === "Resolved") return "pill--resolved";
  return "pill--progress";
}
function badgeClass(key) {
  return `badge--${key}`;
}

const tbody = $("#tbody");
tbody.innerHTML = rows
  .map(
    (r) => `
  <tr>
    <td><strong>${r.id}</strong></td>
    <td>
      <span class="badge ${badgeClass(r.typeKey)}">
        <span class="badge__dot" style="background:rgba(0,0,0,.15)"></span>
        ${r.type}
      </span>
    </td>
    <td style="color:#4b5563;font-weight:700;">${r.loc}</td>
    <td><span class="pill ${pillClass(r.status)}">${r.status}</span></td>
    <td style="color:#111827;font-weight:800;">${r.date}</td>
  </tr>
`,
  )
  .join("");
