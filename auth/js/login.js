//js/login.js

//const API = 'http://localhost:5000/api/v1';   // Development 

const API = 'https://trashbeta.onrender.com/api/v1'    //Production

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    alert("Please enter both email and password");
    return;
  }

  	try {
	    const res = await fetch(`${API}/auth/login`, {
	      method: "POST",
	      headers: { "Content-Type": "application/json" },
	      body: JSON.stringify({ email, password }),
	    });

	    const data = await res.json();

	    //IF USER NOT VERIFIED
	    if (!res.ok && data.message === "Please verify your account first") {
	      alert("Please verify your email first. OTP will be sent.");

	      // Save email temporarily
	      localStorage.setItem("verifyEmail", email);

	      // Redirect to resend OTP page
	      window.location.href = `resend-otp.html?email=${encodeURIComponent(email)}`;
	      return;
	    }

	    if (res.ok) {
	      //Save token for future requests
	      localStorage.setItem("token", data.token);

	    	// If onboarding not completed
	  		if (data.onboardingStep) {
	    		localStorage.setItem("onboardingStep", data.onboardingStep);

	    		if (data.onboardingStep === "VERIFIED") {
	      			window.location.href = "role-select.html";
	    		}
	    		else if (data.onboardingStep === "ROLE_SELECTED" && data.role === "resident") {
	      			window.location.href = "profile-resident.html";
	    		}
	    		else if (data.onboardingStep === "ROLE_SELECTED" && data.role === "staff") {
	      			window.location.href = "profile-staff.html";
	    		}
	    		return;
	  		}

	  		// If onboarding completed
	      	localStorage.setItem("userId", data._id);
	      	localStorage.setItem("role", data.role);
	      	localStorage.setItem("email", data.email);
	      	localStorage.setItem("firstName", data.firstName);
					localStorage.setItem("lastName", data.lastName);
					localStorage.setItem("phone", data.phone);
					localStorage.setItem("isVerified", data.isVerified);


	      	if(data.role === 'resident') {
	      		window.location.href = "../resident/resident-dashboard.html";
	      	} 
	      	else if (data.role === 'staff') {
	      		window.location.href = "../worker/dashboard/index.html";
	      	} 
	      	else if(data.role === 'admin') {
	      		window.location.href = "../admin/dashboard/index.html";
	      	}

    	} else {
      	alert(data.message || "Login failed");
    	}
 	} catch (err) {
    	alert("Something went wrong. Please try again.");
  	}
});


