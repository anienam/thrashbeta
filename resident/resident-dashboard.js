(() => {
  const shell = document.querySelector(".app-shell");
  const menuBtn = document.getElementById("menuBtn");
  const overlay = document.getElementById("overlay");

  const addToCalendarBtn = document.getElementById("addToCalendarBtn");
  const calendarHint = document.getElementById("calendarHint");

  // Sidebar toggle (mobile)
  function openSidebar() {
    shell.classList.add("is-sidebar-open");
    overlay.hidden = false;
  }

  function closeSidebar() {
    shell.classList.remove("is-sidebar-open");
    overlay.hidden = true;
  }

  if (menuBtn) menuBtn.addEventListener("click", openSidebar);
  if (overlay) overlay.addEventListener("click", closeSidebar);

  // Close sidebar when clicking a nav link on mobile
  document.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 880px)").matches) closeSidebar();
      setActiveNav(link.dataset.nav);
    });
  });

  // Active nav (keeps consistent behavior across pages)
  function setActiveNav(key) {
    document.querySelectorAll(".nav__link").forEach((a) => {
      a.classList.toggle("is-active", a.dataset.nav === key);
    });
  }

  // Page default active (if you use data-page on shell)
  const page = shell?.dataset.page;
  if (page) setActiveNav(page);

  // Add to calendar (simple demo action)
  if (addToCalendarBtn) {
    addToCalendarBtn.addEventListener("click", () => {
      calendarHint.textContent = "Saved. Pickup reminder added.";
      addToCalendarBtn.disabled = true;
      addToCalendarBtn.style.opacity = "0.9";
      setTimeout(() => {
        addToCalendarBtn.disabled = false;
        addToCalendarBtn.style.opacity = "1";
        calendarHint.textContent = "";
      }, 2200);
    });
  }

  // Quick actions (hook your routing here)
  document.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;

      // Replace these with real routes later
      if (action === "report") alert("Go to: Report Issue");
      if (action === "track") alert("Go to: Track Issue");
      if (action === "schedule") alert("Go to: Schedule");
    });
  });
})();
