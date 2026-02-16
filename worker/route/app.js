
//const API = "http://localhost:5000/api/v1"; 
 const API = "https://trashbeta.onrender.com/api/v1";

const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");
const email = localStorage.getItem("email");
const role = localStorage.getItem("role");

// =============================
// SESSION HANDLING
// =============================
function clearUserSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("role");
  localStorage.removeItem("email");
  localStorage.removeItem("onboardingStep");
}

if (!token || !role || (role !== "staff" && role !== "admin")) {
  clearUserSession();
  window.location.href = "../../auth/login.html";
} else {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiryTime = payload.exp * 1000 - Date.now();

    if (expiryTime <= 0) {
      clearUserSession();
      window.location.href = "../../auth/login.html";
    } else {
      setTimeout(() => {
        clearUserSession();
        window.location.href = "../../auth/login.html";
      }, expiryTime);
    }
  } catch (err) {
    clearUserSession();
    window.location.href = "../../auth/login.html";
  }
}





async function loadWorkerProfile() {
  try {

    const res = await fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Failed to fetch profile");

    const user = await res.json();

    const nameEl = document.querySelector(".profile-name");
    const avatarImg = document.getElementById("profileAvatar");
    const avatarInitials = document.getElementById("avatarInitials");

    if (nameEl) {
      nameEl.textContent = `${user.firstName} ${user.lastName}`;
    }

    // ✅ If user has uploaded avatar
    if (user.avatar) {
      avatarImg.src = user.avatar;
      avatarImg.style.display = "block";
      avatarInitials.style.display = "none";
    } else {
      // ✅ Fallback to initials
      avatarInitials.textContent =
        `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`;
      avatarInitials.style.display = "block";
      avatarImg.style.display = "none";
    }

  } catch (err) {
    console.error("Profile Load Error:", err.message);
  }
}





loadWorkerProfile()