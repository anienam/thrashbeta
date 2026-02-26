//resident-my-reports.js

//const API = 'http://localhost:5000/api/v1';   // Development 

const API = 'https://trashbeta.onrender.com/api/v1'    //Production

const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");
const email = localStorage.getItem("email");
const role = localStorage.getItem("role");

// TOKEN CHECK & AUTO LOGOUT
function clearUserSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("role");
  localStorage.removeItem("email");
  localStorage.removeItem("onboardingStep");
}


if (token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = payload.exp * 1000 - Date.now();

    // If expired already
    if (expiryTime <= 0) {
      alert("Your session has expired. Please log in again.");
      clearUserSession();
      window.location.href = "../auth/login.html";
    } else {
      // Auto logout when it expires
      setTimeout(() => {
        alert("Your session has expired. Please log in again.");
        clearUserSession();
        window.location.href = "../auth/login.html";
      }, expiryTime);
    }
  } catch (err) {
    alert("Invalid session. Please log in again.");
    clearUserSession();
    window.location.href = "../auth/login.html";
  }
} else {
  alert("Kindly login");
    clearUserSession();
    window.location.href = "../auth/login.html";
}



// ===============================
// Load User Details
// ===============================
async function loadUserDetails() {
  try {
    const res = await fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Failed to fetch user");

    const user = await res.json();

    // Cache user for other pages
    localStorage.setItem("currentUser", JSON.stringify(user));

    injectUserIntoUI(user);

  } catch (err) {
    console.error("Error loading user:", err);
  }
}

function injectUserIntoUI(user) {
  if (!user) return;

  // Full Name
  const fullName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";

  // Sidebar Name
  const nameEl = document.querySelector(".user-mini__name");
  if (nameEl) nameEl.textContent = fullName;

  // Sidebar Sub (email)
  const subEl = document.querySelector(".user-mini__sub");
  if (subEl) subEl.textContent = user.email || "";

  // Avatar
  const avatarUrl =
    user.avatar || "/assets/images/Avatar profile photo5.png";

  const avatarEls = document.querySelectorAll(
    ".user-mini__avatar, .avatar-btn img"
  );

  avatarEls.forEach((img) => {
    img.src = avatarUrl;
  });
}














(() => {
  const grid = document.getElementById("tipsGrid");
  const searchInput = document.getElementById("searchInput");
  const categoryRow = document.getElementById("categoryRow");

  let activeCategory = "recycling";

  // Demo articles (replace later with API)
  const articles = [
    {
      id: "a1",
      category: "recycling",
      label: "Recycling Guide",
      minutes: 6,
      title: "How to Properly Sort Your Recyclables",
      desc: "Recycling is a key part of reducing waste and protecting our environment",
      img: "https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=1200&q=60",
    },
    {
      id: "a2",
      category: "community",
      label: "Community Tips",
      minutes: 6,
      title: "Community Recycling Programs",
      desc: "Recycling is a key part of reducing waste and protecting our environment",
      img: "https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=1200&q=60",
    },
    {
      id: "a3",
      category: "recycling",
      label: "Recycling Guide",
      minutes: 6,
      title: "Eco- Friendly Shopping and Packaging Tips",
      desc: "Recycling is a key part of reducing waste and protecting our environment",
      img: "https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=1200&q=60",
    },
    {
      id: "a4",
      category: "community",
      label: "Community Tips",
      minutes: 6,
      title: "Neighborhood Cleanup Tips",
      desc: "Simple ideas to keep your area clean and encourage community participation.",
      img: "https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=1200&q=60",
    },
    {
      id: "a5",
      category: "community",
      label: "Community Tips",
      minutes: 6,
      title: "How to Report Issues Effectively",
      desc: "What details to include when reporting so workers can respond faster.",
      img: "https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=1200&q=60",
    },
    {
      id: "a6",
      category: "whatnot",
      label: "What Not to Do",
      minutes: 6,
      title: "Common Recycling Mistakes",
      desc: "Avoid contamination and improve recycling outcomes in your community.",
      img: "https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=1200&q=60",
    },
  ];

  function iconForLabel(label) {
    const l = (label || "").toLowerCase();
    if (l.includes("recycling")) return "♻";
    if (l.includes("community")) return "💡";
    if (l.includes("not")) return "⛔";
    if (l.includes("compost")) return "🍃";
    return "🗑";
  }

  function matchesSearch(a, q) {
    if (!q) return true;
    const s = q.toLowerCase();
    return (
      a.title.toLowerCase().includes(s) ||
      a.desc.toLowerCase().includes(s) ||
      a.label.toLowerCase().includes(s)
    );
  }

  function render() {
    const q = searchInput.value.trim();

    const filtered = articles.filter((a) => {
      if (activeCategory && a.category !== activeCategory) return false;
      return matchesSearch(a, q);
    });

    grid.innerHTML = "";

    filtered.forEach((a) => {
      const card = document.createElement("article");
      card.className = "tip-card";

      card.innerHTML = `
        <div class="tip-media">
          <img src="${a.img}" alt="${a.title}" loading="lazy" />
          <span class="tag">${iconForLabel(a.label)} ${a.label}</span>
          <span class="time">${a.minutes} min</span>
        </div>
        <div class="tip-body">
          <h3>${a.title}</h3>
          <p>${a.desc}</p>
          <button class="read-btn" type="button" data-id="${a.id}">
            Read Article →
          </button>
        </div>
      `;

      grid.appendChild(card);
    });

    // bind buttons
    grid.querySelectorAll(".read-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        alert(`Open article details page for: ${id}`);
        // Later: window.location.href = `resident-article.html?id=${encodeURIComponent(id)}`;
      });
    });
  }

  // Category click
  categoryRow.addEventListener("click", (e) => {
    const btn = e.target.closest(".cat-pill");
    if (!btn) return;

    categoryRow
      .querySelectorAll(".cat-pill")
      .forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");

    activeCategory = btn.dataset.cat;
    render();
  });

  // Search
  searchInput.addEventListener("input", render);

  render();
})();





document.addEventListener("DOMContentLoaded", async () => {

  // Try cached user first
  const cachedUser = localStorage.getItem("currentUser");

  if (cachedUser) {
    injectUserIntoUI(JSON.parse(cachedUser));
  } else {
    await loadUserDetails();
  }

  // Continue your calendar initialization here
  initCalendar(); // if you already have this
});