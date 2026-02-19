//resident-report-success.js

//const API = 'http://localhost:5000/api/v1';   // Development

const API = "https://trashbeta.onrender.com/api/v1"; //Production

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
    const payload = JSON.parse(atob(token.split(".")[1]));
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

if (!sessionStorage.getItem("trackingId")) {
  window.location.replace("resident-report-1-waste-type.html");
}

document.addEventListener("DOMContentLoaded", () => {
  const trackBtn = document.getElementById("trackBtn");
  const reportAnotherBtn = document.getElementById("reportAnotherBtn");

  // Track button → go to track issue page
  trackBtn?.addEventListener("click", () => {
    // If you want to auto-fill the tracking id later, we can pass it via querystring
    window.location.href = "./resident-track-issue.html";
  });

  // Report another → restart flow at step 1
  reportAnotherBtn?.addEventListener("click", () => {
    window.location.href = "./resident-report-1-waste-type.html";
  });
});
