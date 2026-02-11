//js/new-password.js

//const API = 'http://localhost:5000/api/v1';   // Development 

const API = 'https://trashbeta.onrender.com/api/v1'    //Production


const form = document.getElementById("newPasswordForm");
const newPwdInput = document.getElementById("newPassword");
const confirmPwdInput = document.getElementById("confirmNewPassword");
const newPasswordSuccess = document.getElementById("newPasswordSuccess");
const errorEls = form.querySelectorAll(".error");


// Toggle password visibility
document.getElementById("toggleNewPassword").addEventListener("click", () => {
  newPwdInput.type = newPwdInput.type === "password" ? "text" : "password";
});
document.getElementById("toggleConfirmNewPassword").addEventListener("click", () => {
  confirmPwdInput.type = confirmPwdInput.type === "password" ? "text" : "password";
});


// Extract token from query string
const params = new URLSearchParams(window.location.search);
///const token = window.location.pathname.split("/").pop();
const token = params.get("token");

if (!token) {
  alert("Invalid password reset link");
  window.location.href = "reset-password.html";
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

 	// Clear previous errors
  	errorEls.forEach(el => el.textContent = "");
  	newPasswordSuccess.textContent = "";

  	const password = newPwdInput.value.trim();
  	const confirmPassword = confirmPwdInput.value.trim();

    if (!password) { errorEls[0].textContent = "New password is required"; return; }
  	if (!confirmPassword) { errorEls[1].textContent = "Confirm password is required"; return; }
  	if (password !== confirmPassword) { errorEls[1].textContent = "Passwords do not match"; return; }

    
    try {
    	const res = await fetch(`${API}/auth/reset-password/${token}`, {
	      	method: "PUT",
	      	headers: { "Content-Type": "application/json" },
	      	body: JSON.stringify({ password, confirmPassword }),
	    });

	    const data = await res.json();
	    
	    if(res.ok) {
	    	window.location.href = "./success.html";
	    } else {
	    	alert(data.message || "Password reset failed");
	    }
    } catch (err) {
    	errorEls[1].textContent = "Something went wrong. Please try again.";
	    alert("Something went wrong. Please try again.");
	}
});