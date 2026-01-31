(function () {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  const sidebarOpen = document.getElementById("sidebarOpen");
  const sidebarClose = document.getElementById("sidebarClose");

  const searchInput = document.getElementById("searchInput");
  const routeList = document.getElementById("routeList");

  const toast = document.getElementById("toast");

  const zoomIn = document.getElementById("zoomIn");
  const zoomOut = document.getElementById("zoomOut");
  const recenter = document.getElementById("recenter");
  const map = document.getElementById("map");
  const mapGrid = map.querySelector(".map__grid");

  const goOfflineBtn = document.getElementById("goOfflineBtn");

  let mapScale = 1;

  function openSidebar() {
    sidebar.classList.add("is-open");
    overlay.hidden = false;
  }

  function closeSidebar() {
    sidebar.classList.remove("is-open");
    overlay.hidden = true;
  }

  function showToast(message) {
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => {
      toast.hidden = true;
    }, 2200);
  }

  // Sidebar toggle (mobile)
  if (sidebarOpen) sidebarOpen.addEventListener("click", openSidebar);
  if (sidebarClose) sidebarClose.addEventListener("click", closeSidebar);
  if (overlay) overlay.addEventListener("click", closeSidebar);

  // ESC closes sidebar (mobile)
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar.classList.contains("is-open"))
      closeSidebar();
  });

  // Search filter for tasks
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = String(e.target.value || "")
        .trim()
        .toLowerCase();
      const cards = routeList.querySelectorAll(".task-card");
      cards.forEach((card) => {
        const hay = (card.getAttribute("data-search") || "").toLowerCase();
        const show = !q || hay.includes(q);
        card.style.display = show ? "" : "none";
      });
    });
  }

  // Button actions
  routeList.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;

    const action = btn.getAttribute("data-action");
    if (action === "navigate") showToast("Starting navigation…");
    if (action === "info") showToast("Opening task info…");
    if (action === "complete") showToast("Marked as complete.");
    if (action === "report") showToast("Opening issue report…");
  });

  // Map controls (placeholder zoom)
  function applyMapScale() {
    mapGrid.style.transform = `scale(${mapScale})`;
    mapGrid.style.transformOrigin = "center";
  }

  zoomIn.addEventListener("click", () => {
    mapScale = Math.min(1.35, +(mapScale + 0.08).toFixed(2));
    applyMapScale();
    showToast(`Zoom: ${Math.round(mapScale * 100)}%`);
  });

  zoomOut.addEventListener("click", () => {
    mapScale = Math.max(0.85, +(mapScale - 0.08).toFixed(2));
    applyMapScale();
    showToast(`Zoom: ${Math.round(mapScale * 100)}%`);
  });

  recenter.addEventListener("click", () => {
    mapScale = 1;
    applyMapScale();
    showToast("Recentered.");
  });

  // Offline button
  goOfflineBtn.addEventListener("click", () => {
    const isOffline = goOfflineBtn.getAttribute("data-state") === "offline";

    if (!isOffline) {
      goOfflineBtn.setAttribute("data-state", "offline");
      goOfflineBtn.textContent = "Go Online";
      goOfflineBtn.style.background = "#111827";
      showToast("You are now offline.");
    } else {
      goOfflineBtn.setAttribute("data-state", "online");
      goOfflineBtn.innerHTML =
        '<span class="btn__icon" aria-hidden="true">↩</span> Go Offline';
      goOfflineBtn.style.background = "";
      showToast("Back online.");
    }
  });

  // Initial
  applyMapScale();
})();
