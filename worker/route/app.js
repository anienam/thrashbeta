(function () {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const sidebarOpen = document.getElementById("sidebarOpen");
  const sidebarClose = document.getElementById("sidebarClose");

  const toast = document.getElementById("toast");
  const mapBg = document.querySelector(".map__bg");

  const zoomIn = document.getElementById("zoomIn");
  const zoomOut = document.getElementById("zoomOut");
  const recenter = document.getElementById("recenter");

  const emergencyBtn = document.getElementById("emergencyBtn");
  const resumeBtn = document.getElementById("resumeBtn");
  const completedBtn = document.getElementById("completedBtn");
  const detailsBtn = document.getElementById("detailsBtn");
  const pauseMoveBtn = document.getElementById("pauseMoveBtn");
  const viewAllBtn = document.getElementById("viewAllBtn");

  let mapScale = 1;

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

  function applyMapScale() {
    mapBg.style.transform = `scale(${mapScale})`;
    mapBg.style.transformOrigin = "center";
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

  emergencyBtn.addEventListener("click", () =>
    showToast("Emergency report opened…"),
  );
  resumeBtn.addEventListener("click", () => showToast("Resuming collection…"));
  completedBtn.addEventListener("click", () =>
    showToast("Stop marked completed."),
  );
  detailsBtn.addEventListener("click", () => {
    showToast("Opening stop details…");
    // You can route to task details if needed:
    // window.location.href = "worker-task-details.html?id=TB-xxxx";
  });

  let paused = false;
  pauseMoveBtn.addEventListener("click", () => {
    paused = !paused;
    pauseMoveBtn.textContent = paused ? "▶" : "⏸";
    showToast(paused ? "Movement paused." : "Resumed moving.");
  });

  viewAllBtn.addEventListener("click", () => showToast("Viewing all stops…"));

  applyMapScale();
})();
