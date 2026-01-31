(function () {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const sidebarOpen = document.getElementById("sidebarOpen");
  const sidebarClose = document.getElementById("sidebarClose");

  const sidebarDispatch = document.getElementById("sidebarDispatch");

  const toast = document.getElementById("toast");
  const countdownEl = document.getElementById("countdown");

  const taskIdText = document.getElementById("taskIdText");
  const locationText = document.getElementById("locationText");

  const nextTaskBtn = document.getElementById("nextTaskBtn");
  const dashboardBtn = document.getElementById("dashboardBtn");
  const viewReportBtn = document.getElementById("viewReportBtn");

  function showToast(message) {
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => (toast.hidden = true), 2200);
  }

  function openSidebar() {
    sidebar.classList.add("is-open");
    overlay.hidden = false;
  }
  function closeSidebar() {
    sidebar.classList.remove("is-open");
    overlay.hidden = true;
  }

  if (sidebarOpen) sidebarOpen.addEventListener("click", openSidebar);
  if (sidebarClose) sidebarClose.addEventListener("click", closeSidebar);
  if (overlay) overlay.addEventListener("click", closeSidebar);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar.classList.contains("is-open"))
      closeSidebar();
  });

  // Populate from query params
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (id) taskIdText.textContent = `#${id}`;

  // Actions
  nextTaskBtn.addEventListener("click", () => {
    showToast("Loading next task…");
    // Replace later with your real "next task" route
    setTimeout(() => {
      window.location.href = "worker-dashboard.html";
    }, 450);
  });

  dashboardBtn.addEventListener("click", () => {
    window.location.href = "worker-dashboard.html";
  });

  viewReportBtn.addEventListener("click", () => {
    showToast("Opening report…");
  });

  sidebarDispatch.addEventListener("click", () => {
    showToast("Connecting to dispatch…");
  });

  // Auto redirect countdown (15s)
  let t = 15;
  countdownEl.textContent = String(t);

  const timer = setInterval(() => {
    t -= 1;
    countdownEl.textContent = String(t);
    if (t <= 0) {
      clearInterval(timer);
      window.location.href = "worker-dashboard.html";
    }
  }, 1000);
})();
