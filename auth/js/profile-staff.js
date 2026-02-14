//js/profile-staff.js

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

if(role !== "staff" && role !== "admin") {
	alert("You are not a staff");
    window.location.href = "profile-resident.html";
}
if (token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = payload.exp * 1000 - Date.now();

    // If expired already
    if (expiryTime <= 0) {
      alert("Your session has expired. Please log in again.");
      clearUserSession();
      window.location.href = "login.html";
    } else {
      // Auto logout when it expires
      setTimeout(() => {
        alert("Your session has expired. Please log in again.");
        clearUserSession();
        window.location.href = "login.html";
      }, expiryTime);
    }
  } catch (err) {
    alert("Invalid session. Please log in again.");
    clearUserSession();
    window.location.href = "login.html";
  }
} else {
	alert("Kindly login");
    clearUserSession();
    window.location.href = "login.html";
}

const staffProfileForm = document.getElementById("staffProfileForm");

staffProfileForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const locationArea = staffProfileForm.elements["zone"].value.trim();
  	const cityLGA = staffProfileForm.elements["city"].value.trim();

    if (!locationArea) {
      alert( "Area/Neighborhood is required.");
      return;
    }
    if (!cityLGA) {
      alert( "City/LGA is required.");
      return;
    }

    try {
    	const res = await fetch(`${API}/auth/profile`, {
    		method: 'PUT',
    		headers: { 
    			"Content-Type": "application/json",
    			"Authorization": `Bearer ${token}`
    		},
      		body: JSON.stringify({  
      			email,
	        	locationArea,
	        	cityLGA
      		}),
    	});

    	const data = await res.json();

    	if (res.ok) {
    		alert("Staff profile updated");
    		window.location.href = "../worker/dashboard/index.html";
    	}  else {
      		alert(data.message || "	Staff profile update failed");
    	}
    } catch (err) {
	    alert("Something went wrong. Please try again.");
	}
 
});
