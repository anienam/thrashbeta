//js/resend-otp.js

//const API = 'http://localhost:5000/api/v1';   // Development 

const API = 'https://trashbeta.onrender.com/api/v1'    //Production

// Get email from query param if available
const urlParams = new URLSearchParams(window.location.search);
const queryEmail = urlParams.get("email");


const  emailInput = document.getElementById("email");

// Auto-fill email if passed
if (queryEmail) {
  	emailInput.value = queryEmail;
}

//Handle resend OtP
document.getElementById("resetForm").addEventListener("submit", async (e) => {
  	e.preventDefault();

  	const email = emailInput.value.trim().toLowerCase();

  	if (!email) {
    	alert("Email is required");
    	return;
  	}

  	try {
    	const res = await fetch(`${API}/auth/resendOtp`, {
      		method: "POST",
      		headers: { "Content-Type": "application/json" },
      		body: JSON.stringify({ email }),
    	});

    	const data = await res.json();

    	if (res.ok) {
      		alert("New OTP sent to email");
      		window.location.href = `otp.html?email=${encodeURIComponent(email)}`;
    	} else {
      		alert(data.message || "Failed to resend OTP");
    	}
  	} catch (err) {
    	alert("Something went wrong. Please try again.");
  	}
});