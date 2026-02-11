//js/otp.js

//const API = 'http://localhost:5000/api/v1';   // Development 

const API = 'https://trashbeta.onrender.com/api/v1'    //Production

//Parse query params
const urlParams = new URLSearchParams (window.location.search);
const email = urlParams.get('email') || localStorage.getItem("verifyEmail");

if (!email) {
	alert("Missing email. Please register again.");
  	window.location.href = "register.html";
}

//Handle verify botton 
const otpForm = document.getElementById('otpForm');
const otpInputs = document.querySelectorAll ('.otp-boxes input');


otpForm.addEventListener('submit', async (e) => {
	e.preventDefault();

	// Collect OTP from 4 inputs
  	const otp = Array.from(otpInputs).map((input) => input.value).join("");

  	if (otp.length !== 4) {
    	alert("Please enter the 4-digit code");
    	return;
  	}

  	try {
  		const res = await fetch (`${API}/auth/verifyOtp`, {
  			method: "POST",
      		headers: { "Content-Type": "application/json" },
      		body: JSON.stringify({ email, otp }),
  		}); 

  		const data = await res.json();

  		if (res.ok) {
  			// Save user details from backend response
		    localStorage.setItem("token", data.token);
		    localStorage.setItem("userId", data._id);
		    localStorage.setItem("email", data.email);
		    localStorage.setItem("onboardingStep", data.onboardingStep);

		    alert("Account verified successfully");
		    window.location.href = "success.html";
  		} else {
      		alert(data.message || "Verification failed");
    	}
  	} catch (err) {
    	alert("Something went wrong. Please try again.");
  	}
});




//Handle resend OtP
document.querySelector(".otp-timer").addEventListener("click", async (e) => {
  	e.preventDefault();

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