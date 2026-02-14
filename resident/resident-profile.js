//resident-profile.js

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



// DOM elements
const displayName = document.getElementById("displayName");
const displayEmail = document.getElementById("displayEmail");
const memberSince = document.getElementById("memberSince");
const profileAvatar = document.getElementById("profileAvatar");
const topAvatar = document.getElementById("topAvatar");

const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const addressInput = document.getElementById("address");
const lgaInput = document.getElementById("lga");
const profileForm = document.getElementById("profileForm");
const photoInput = document.getElementById("photoInput");
const changePhotoBtn = document.getElementById("changePhotoBtn");
const saveMsg = document.getElementById("saveMsg");
const cancelBtn = document.getElementById("cancelBtn");

let selectedPhoto = null;

// Fetch and display profile
async function loadProfile() {
  try {
    const res = await fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = await res.json();

    fullNameInput.value = `${user.firstName || ""} ${user.lastName || ""}`;
    emailInput.value = user.email || "";
    phoneInput.value = user.phone || "";
    addressInput.value = user.address || "";
    lgaInput.value = user.cityLGA || "";

    displayName.textContent = `${user.firstName || ""} ${user.lastName || ""}`;
    displayEmail.textContent = user.email;
    memberSince.textContent = `Member since ${new Date(user.createdAt).toLocaleDateString()}`;

    const avatarUrl = user.avatar || "/assets/images/Avatar profile photo5.png";
    profileAvatar.src = avatarUrl;
    topAvatar.src = avatarUrl;

  } catch (err) {
    console.error("Error loading profile:", err);
  }
}

loadProfile();

// Handle avatar selection
changePhotoBtn.addEventListener("click", () => photoInput.click());
photoInput.addEventListener("change", () => {
  selectedPhoto = photoInput.files[0];
  if (selectedPhoto) profileAvatar.src = URL.createObjectURL(selectedPhoto);
});

// Update profile
profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    saveMsg.textContent = "Saving...";

    const fullName = fullNameInput.value.trim();
    const [firstName, ...lastParts] = fullName.split(" ");
    const lastName = lastParts.join(" ");

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("phone", phoneInput.value);
    formData.append("address", addressInput.value);
    formData.append("cityLGA", lgaInput.value);
    if (selectedPhoto) formData.append("avatar", selectedPhoto);

    const res = await fetch(`${API}/auth/user/profile`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update profile");

    saveMsg.textContent = "Profile updated successfully!";
    selectedPhoto = null;
    loadProfile();
  } catch (err) {
    saveMsg.textContent = err.message;
  }
});

// Cancel button reloads profile
cancelBtn.addEventListener("click", loadProfile);



(() => {
  const $ = (q) => document.querySelector(q);

  const tabs = document.querySelectorAll(".tab-pill");
  const panels = document.querySelectorAll(".panel");



  

  // Tabs
  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabs.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      const tab = btn.dataset.tab;
      panels.forEach((p) =>
        p.classList.toggle("is-active", p.dataset.panel === tab),
      );
    });
  });



  
})();
