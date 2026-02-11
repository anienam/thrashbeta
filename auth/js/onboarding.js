//js/onboarding.js

//const API = 'http://localhost:5000/api/v1';   // Development 

const API = 'https://trashbeta.onrender.com/api/v1'    //Production

const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");

// TOKEN CHECK & AUTO LOGOUT
function clearUserSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
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

//RECHECK TOKEN
function verifyToken() {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

// ---------- ONBOARDING (3 slides) ----------
const onboardNext = document.getElementById("onboardNext");

onboardNext.addEventListener("click", () => {

  	if (!verifyToken()) {
    	alert("Session expired. Please log in again.");
    	clearUserSession();
    	window.location.href = "login.html";
    	return;
  	}

  
  	if (onboardNext) {
  		const imageEl = document.getElementById("onboardImage");
  		const titleEl = document.getElementById("onboardTitle");
  		const textEl = document.getElementById("onboardText");
  		const dots = Array.from(document.querySelectorAll(".dot"));

	  	const slides = [
	    	{
	      		img: "../assets/images/Onboarding 01.png",
	      		title: "Report Waste Issues in Seconds",
	      		text: "Easily report overflowing bins, illegal dumping, or blocked drains in your area and help keep your environment clean and safe.",
	    	},
	    	{
	      		img: "../assets/images/Onboarding 02.png",
	      		title: "Track Cleanup Progress in Real Time",
	      		text: "Stay updated on the status of your report and see when action is taken, from review to final resolution.",
	    	},
	    	{
	      		img: "../assets/images/Onboarding 03.png",
	      		title: "Stay Informed and Dispose Waste Properly",
	      		text: "View waste pickup schedules, learn proper disposal methods, and make smarter choices for a cleaner community.",
	    	},
	  	];

	  	let current = 0;

	  	function renderSlide(idx) {
	    	const s = slides[idx];
	    	if (imageEl) imageEl.src = s.img;
	    	if (titleEl) titleEl.textContent = s.title;
	    	if (textEl) textEl.textContent = s.text;

	    	dots.forEach((d, i) => d.classList.toggle("active", i === idx));
	    	onboardNext.textContent =
	      	idx === slides.length - 1 ? "Get Started" : "Continue";
	  	}

	  	// optional: click dots to jump
	  	dots.forEach((d) => {
	    	d.addEventListener("click", () => {
	      		const idx = Number(d.dataset.dot);
	      		current = idx;
	      		renderSlide(current);
	    	});
	    	d.style.cursor = "pointer";
	  	});

	  	onboardNext.addEventListener("click", () => {
	    	if (current < slides.length - 1) {
	      		current += 1;
	      		renderSlide(current);
	    	} else {
	      		// final step → login or register
	      		window.location.href = "role-select.html";
	    	}
	  	});

	  	renderSlide(current);
	}
});


