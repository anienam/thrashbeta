//js/register.js

//const API = 'http://localhost:5000/api/v1';   // Development 

const API = 'https://trashbeta.onrender.com/api/v1'    //Production



const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const firstName = form.elements["firstName"].value.trim();
  const lastName = form.elements["lastName"].value.trim();
  const email = form.elements["email"].value.trim().toLowerCase();
  const password = form.elements["password"].value;
  const confirmPassword = form.elements["confirmPassword"].value;
  const agree = form.elements["agree"];

  if (password !== confirmPassword) {
    setFieldError("Passwords do not match!");
    return;
  }

  if (!agree.checked) {
    const agreeError = document.getElementById("agreeError");
    if (agreeError) {
      agreeError.textContent =
        "You must agree to the Terms and Privacy Policy.";
    }
    return;
  }


  try {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password, confirmPassword })
    });

    const data = await res.json();

    if(res.ok) {
      localStorage.setItem("verifyEmail", email);
      window.location.href = `otp.html?email=${encodeURIComponent(email)}`;
    } else {
      alert(data.message || "Registration failed");
    }
  } catch (err) {
    alert("Something went wrong. Please try again.");
    console.error(err);
  }
});
