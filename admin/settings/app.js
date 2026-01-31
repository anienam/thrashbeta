/* =========================
   TrashBeta • Admin Settings
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

/* ---------- Inner tabs ---------- */
const tabBtns = $$(".subnav__item");
const panes = $$(".content [data-pane]");

function setTab(tab) {
  tabBtns.forEach((b) =>
    b.classList.toggle("is-active", b.dataset.tab === tab),
  );
  panes.forEach((p) => p.classList.toggle("is-active", p.dataset.pane === tab));
}

tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => setTab(btn.dataset.tab));
});

/* default (General) */
setTab("general");

/* ---------- Copy API key (visual only) ---------- */
const copyBtn = $("#copyBtn");
copyBtn?.addEventListener("click", async () => {
  const apiKey = $("#apiKey");
  const value = apiKey?.value || "";
  try {
    await navigator.clipboard.writeText(value);
    const old = copyBtn.textContent;
    copyBtn.textContent = "Copied";
    setTimeout(() => (copyBtn.textContent = old), 1200);
  } catch {
    // fallback
    apiKey?.select?.();
    document.execCommand?.("copy");
    copyBtn.textContent = "Copied";
    setTimeout(() => (copyBtn.textContent = "Copy"), 1200);
  }
});
