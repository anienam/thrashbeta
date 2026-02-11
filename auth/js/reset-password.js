//js/reset-password.js

//const API = 'http://localhost:5000/api/v1';   // Development 

const API = 'https://trashbeta.onrender.com/api/v1'    //Production

const form = document.getElementById("resetForm");
const resetSuccess = document.getElementById("resetSuccess");
const emailError = form.querySelector('small.error');

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form.elements["email"].value.trim();
  emailError.textContent = "";
  resetSuccess.textContent = "";

  if (!email) {
    alert("Email is required");
    return;
  }

  try {
    const res = await fetch(`${API}/auth/forgotPassword`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({  email })
    });

    const data = await res.json();

    if(res.ok) {
      alert ('Kindly check your email for password reset link');
    } else {
      alert(data.message || "Forgot Password Failed");
    }
  } catch (err) {
    alert("Something went wrong. Please try again.");
    console.error(err);
  }
});
