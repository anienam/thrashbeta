//js/role-select.js

//const API = 'http://localhost:5000/api/v1';   // Development 

const API = 'https://trashbeta.onrender.com/api/v1'    //Production

const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");
const email = localStorage.getItem("email"); 

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





// ---------- ROLE SELECT ----------
const roleContinue = document.getElementById("roleContinue");
const roleCards = Array.from(document.querySelectorAll(".role-card"));

if (roleContinue && roleCards.length) {

  	let selectedRole = "resident"; // default

  	function setSelected(role) {
    	selectedRole = role;

    	roleCards.forEach((card) => {
      		const isSelected = card.dataset.role === role;
      		card.classList.toggle("selected", isSelected);
      		card.setAttribute("aria-checked", isSelected ? "true" : "false");
    	});

    	roleContinue.textContent =
      		role === "resident" ? "Continue as Resident" : "Continue as Staff";
  	}

  	roleCards.forEach((card) => {
    	card.addEventListener("click", () => setSelected(card.dataset.role));
  		card.addEventListener("keydown", (e) => {
      		if (e.key === "Enter" || e.key === " ") {
        		e.preventDefault();
        		setSelected(card.dataset.role);
      		}
    	});
  	});

  	roleContinue.addEventListener("click", async (e) => {
  		e.preventDefault();

  		try {
    		const res = await fetch(`${API}/auth/role`, {
      			method: "PUT",
      			headers: { 
      				"Content-Type": "application/json",
      				"Authorization": `Bearer ${token}`
      			},
      			body: JSON.stringify({ role: selectedRole }),
    		});

    		const data = await res.json();

    		if (res.ok) {
      			// Save role from nested user object
            const role = data.user.role;
            localStorage.setItem("role", role);
      		

      			alert(`${role} Account verified successfully`);
      	
      			if (role === "resident") {
      				window.location.href = "profile-resident.html";
    			} else if (role === "staff"){
      				window.location.href = "profile-staff.html";
    			}

    		} else {
     		alert(data.message || "Verification failed");
    		}
  		} catch (err) {
    		alert("Something went wrong. Please try again.");
  		}
	});

	setSelected(selectedRole);
}