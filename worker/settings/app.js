//app.js

//const API = 'http://localhost:5000/api/v1'; // Development
const API = 'https://trashbeta.onrender.com/api/v1'; // Production

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

if (!token || !role || (role !== "staff" && role !== "admin")) {
  clearUserSession();
  window.location.href = "../../auth/login.html";
} else {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = payload.exp * 1000 - Date.now();

    if (expiryTime <= 0) {
      alert("Your session has expired. Please log in again.");
      clearUserSession();
      window.location.href = "../../auth/login.html";
    } else {
      setTimeout(() => {
        alert("Your session has expired. Please log in again.");
        clearUserSession();
        window.location.href = "../../auth/login.html";
      }, expiryTime);
    }
  } catch {
    alert("Invalid session. Please log in again.");
    clearUserSession();
app.js    window.location.href = "../../auth/login.html";
  }


}
async function loadIntegration() {
  try {
    const res = await fetch(`${API}/integration`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    document.getElementById("apiKey").value = data.apiKey;
    
    if (data.webhookUrl) {
      document.querySelector("input[type='url']").value = data.webhookUrl;
    }

  } catch (err) {
    showToast("Failed to load integration");
  }
}

loadIntegration();
