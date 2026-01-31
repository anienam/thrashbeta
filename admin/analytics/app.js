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
