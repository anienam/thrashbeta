(function () {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const sidebarOpen = document.getElementById("sidebarOpen");
  const sidebarClose = document.getElementById("sidebarClose");

  const toast = document.getElementById("toast");
  const sidebarDispatch = document.getElementById("sidebarDispatch");

  const navButtons = Array.from(document.querySelectorAll(".snavItem"));
  const copyKeyBtn = document.getElementById("copyKeyBtn");
  const apiKey = document.getElementById("apiKey");
  const addIntegrationBtn = document.getElementById("addIntegrationBtn");

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

  function setActive(targetId) {
    navButtons.forEach((b) => b.classList.remove("is-active"));
    const active = navButtons.find((b) => b.dataset.target === targetId);
    if (active) active.classList.add("is-active");
  }

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
    history.replaceState(null, "", `#${id}`);
  }

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.target;
      scrollToSection(id);
    });
  });

  // Start on hash if present
  const initialHash = (window.location.hash || "").replace("#", "");
  if (initialHash) {
    setActive(initialHash);
  }

  // Copy API key
  copyKeyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(apiKey.value);
      showToast("API key copied.");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = apiKey.value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      showToast("API key copied.");
    }
  });

  addIntegrationBtn.addEventListener("click", () => {
    showToast("Add New Integration clicked.");
  });

  sidebarDispatch.addEventListener("click", () => {
    showToast("Connecting to dispatch…");
  });

  // Optional: update active tab as you scroll
  const sections = ["general", "notifications", "api", "security"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    },
    { root: null, threshold: [0.25, 0.45, 0.65] },
  );

  sections.forEach((s) => io.observe(s));
})();
