/* =========================
   TrashBeta • Users & Permission
   Matches Admin Dashboard nav/layout
   ========================= */

const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => [...el.querySelectorAll(q, el)];

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
  { title: "Total Users", value: "4,281" },
  { title: "Residents", value: "4,120" },
  { title: "Field Staff", value: "145" },
  { title: "Administrators", value: "16" },
];

$("#stats").innerHTML = stats
  .map(
    (s) => `
  <article class="stat">
    <div class="stat__title">${s.title}</div>
    <div class="stat__value">${s.value}</div>
  </article>
`,
  )
  .join("");

/* ---------- Table data ---------- */
const users = [
  {
    name: "Marcus Sterling",
    mail: "m.sterling@gmail.com",
    role: "Collection Staff",
    activity: "Pending",
    last: "2 days ago",
    avatar: "https://i.pravatar.cc/80?img=11",
  },
  {
    name: "Sam Witlock",
    mail: "samwitlock@gmail.com",
    role: "Resident",
    activity: "Active",
    last: "1 hour ago",
    avatar: "https://i.pravatar.cc/80?img=12",
  },
  {
    name: "Janet Joseph",
    mail: "janetjoseph@gmail.com",
    role: "Admin",
    activity: "Inactive",
    last: "Yesterday",
    avatar: "https://i.pravatar.cc/80?img=47",
  },
  {
    name: "Jennie Brown",
    mail: "jbrown@gmail.com",
    role: "Resident",
    activity: "Inactive",
    last: "12 days ago",
    avatar: "https://i.pravatar.cc/80?img=32",
  },
  {
    name: "Nate Witt",
    mail: "natewitt@gmail.com",
    role: "Admin",
    activity: "Active",
    last: "1 min ago",
    avatar: "https://i.pravatar.cc/80?img=15",
  },
  {
    name: "Chloe Evans",
    mail: "chloe.evans@gmail.com",
    role: "Admin",
    activity: "Active",
    last: "2 days ago",
    avatar: "https://i.pravatar.cc/80?img=38",
  },
  {
    name: "Brad Pitt",
    mail: "bradpitt@gmail.com",
    role: "Admin",
    activity: "Active",
    last: "5 hours ago",
    avatar: "https://i.pravatar.cc/80?img=53",
  },
];

function pillClass(status) {
  if (status === "Pending") return "pill--pending";
  if (status === "Active") return "pill--active";
  return "pill--inactive";
}

const tbody = $("#tbody");
function renderTable(list) {
  tbody.innerHTML = list
    .map(
      (u) => `
    <tr>
      <td>
        <div class="user">
          <img class="user__avatar" src="${u.avatar}" alt="${u.name}">
          <div class="user__box">
            <div class="user__name">${u.name}</div>
            <div class="user__mail">${u.mail}</div>
          </div>
        </div>
      </td>
      <td style="color:#6b7280;font-weight:900;">${u.role}</td>
      <td><span class="pill ${pillClass(u.activity)}">${u.activity}</span></td>
      <td style="color:#6b7280;font-weight:900;">${u.last}</td>
      <td>
        <div class="actions">
          <button class="icon-action" title="Edit" aria-label="Edit user">✎</button>
          <button class="icon-action" title="View" aria-label="View user">👤</button>
        </div>
      </td>
    </tr>
  `,
    )
    .join("");
}
renderTable(users);

/* ---------- Dropdown filter (Type All) ---------- */
const typeBtn = $("#typeBtn");
const typeDrop = $("#typeDrop");
let selectedType = "All";

function openDrop() {
  typeDrop.hidden = false;
  typeBtn.setAttribute("aria-expanded", "true");
}
function closeDrop() {
  typeDrop.hidden = true;
  typeBtn.setAttribute("aria-expanded", "false");
}

typeBtn?.addEventListener("click", () => {
  typeDrop.hidden ? openDrop() : closeDrop();
});

document.addEventListener("click", (e) => {
  if (e.target.closest("#typeBtn") || e.target.closest("#typeDrop")) return;
  closeDrop();
});

$$(".drop-item").forEach((btn) => {
  btn.addEventListener("click", () => {
    selectedType = btn.dataset.type;
    typeBtn.childNodes[0].textContent = `Type ${selectedType} `;
    closeDrop();

    if (selectedType === "All") return renderTable(users);
    renderTable(users.filter((u) => u.role === selectedType));
  });
});
