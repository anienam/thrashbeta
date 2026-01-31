(function () {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const sidebarOpen = document.getElementById("sidebarOpen");
  const sidebarClose = document.getElementById("sidebarClose");

  const toast = document.getElementById("toast");
  const backBtn = document.getElementById("backBtn");

  const copyAddressBtn = document.getElementById("copyAddressBtn");
  const markCompleteBtn = document.getElementById("markCompleteBtn");
  const statusSelect = document.getElementById("statusSelect");

  const addPhotoBtn = document.getElementById("addPhotoBtn");
  const uploadTile = document.getElementById("uploadTile");
  const photoInput = document.getElementById("photoInput");
  const photoRow = document.getElementById("photoRow");

  const sidebarDispatch = document.getElementById("sidebarDispatch");
  const contactDispatchBtn = document.getElementById("contactDispatchBtn");

  const zoomIn = document.getElementById("zoomIn");
  const zoomOut = document.getElementById("zoomOut");
  const recenter = document.getElementById("recenter");
  const mapBg = document.querySelector(".map__bg");

  const TASK_ID = "TB-8942";
  const ADDRESS = "122 Oakwood Dr., Greenside Heights, North District";
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

  // Sidebar (mobile)
  if (sidebarOpen) sidebarOpen.addEventListener("click", openSidebar);
  if (sidebarClose) sidebarClose.addEventListener("click", closeSidebar);
  if (overlay) overlay.addEventListener("click", closeSidebar);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar.classList.contains("is-open"))
      closeSidebar();
  });

  // Back
  backBtn.addEventListener("click", () => {
    // safe fallback to dashboard
    if (history.length > 1) history.back();
    else window.location.href = "worker-dashboard.html";
  });

  // Copy address
  copyAddressBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(ADDRESS);
      showToast("Address copied.");
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = ADDRESS;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      showToast("Address copied.");
    }
  });

  // Status change
  statusSelect.addEventListener("change", () => {
    const label = statusSelect.options[statusSelect.selectedIndex].text;
    showToast(`Status: ${label}`);
  });

  // Mark complete -> go to success page
  markCompleteBtn.addEventListener("click", () => {
    // If you want to enforce status before completing:
    // if (statusSelect.value !== "completed") { ... }
    showToast("Completing task…");
    setTimeout(() => {
      window.location.href = `worker-task-complete.html?id=${encodeURIComponent(TASK_ID)}`;
    }, 450);
  });

  // Evidence upload
  function openFilePicker() {
    photoInput.click();
  }
  addPhotoBtn.addEventListener("click", openFilePicker);
  uploadTile.addEventListener("click", openFilePicker);
  uploadTile.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") openFilePicker();
  });

  photoInput.addEventListener("change", () => {
    const files = Array.from(photoInput.files || []);
    if (!files.length) return;

    files.slice(0, 6).forEach((file) => {
      const url = URL.createObjectURL(file);

      const wrap = document.createElement("div");
      wrap.className = "photo photo--img";
      wrap.title = file.name;

      const img = document.createElement("img");
      img.src = url;
      img.alt = "Evidence photo";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";

      wrap.appendChild(img);
      photoRow.insertBefore(wrap, uploadTile);
    });

    showToast("Photo added.");
    photoInput.value = "";
  });

  // Dispatch buttons
  function contactDispatch() {
    showToast("Connecting to dispatch…");
  }
  sidebarDispatch.addEventListener("click", contactDispatch);
  contactDispatchBtn.addEventListener("click", contactDispatch);

  // Map controls (placeholder zoom effect)
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

  applyMapScale();
})();
