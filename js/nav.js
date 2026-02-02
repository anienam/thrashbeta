document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("tbBurger");
  const nav = document.getElementById("tbNav");
  const links = document.querySelectorAll("[data-nav]");

  if (!burger || !nav) return;

  burger.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  nav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      nav.classList.remove("open");
    }
  });

  // Active link (root + /public safe)
  const normalize = (path) =>
    path.replace(/\/$/, "").replace("/index.html", "") || "/";

  const current = normalize(window.location.pathname);

  links.forEach((link) => {
    const linkPath = normalize(new URL(link.href).pathname);
    if (linkPath === current) {
      link.classList.add("is-active");
    }
  });
});
