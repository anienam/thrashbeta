

// ---------- Helpers ----------
function setFieldError(field, message) {
  const wrapper = field.closest(".field");
  if (!wrapper) return;
  const error = wrapper.querySelector(".error");
  if (error) error.textContent = message;
}

function clearErrors(scope) {
  const root = scope || document;
  root.querySelectorAll(".error").forEach((e) => (e.textContent = ""));
  const agreeError = document.getElementById("agreeError");
  if (agreeError) agreeError.textContent = "";
}

function isValidEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}


/*
// ---------- REGISTER ----------
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors(registerForm);

    const firstName = registerForm.elements["firstName"];
    const lastName = registerForm.elements["lastName"];
    const email = registerForm.elements["email"];
    const password = registerForm.elements["password"];
    const confirmPassword = registerForm.elements["confirmPassword"];
    const agree = registerForm.elements["agree"];

    let ok = true;

    if (!firstName.value.trim()) {
      setFieldError(firstName, "First name is required.");
      ok = false;
    }
    if (!lastName.value.trim()) {
      setFieldError(lastName, "Last name is required.");
      ok = false;
    }

    if (!email.value.trim() || !isValidEmail(email.value.trim())) {
      setFieldError(email, "Enter a valid email address.");
      ok = false;
    }

    if (!password.value || password.value.length < 8) {
      setFieldError(password, "Password must be at least 8 characters.");
      ok = false;
    }

    if (confirmPassword.value !== password.value) {
      setFieldError(confirmPassword, "Passwords do not match.");
      ok = false;
    }

    if (!agree.checked) {
      const agreeError = document.getElementById("agreeError");
      if (agreeError)
        agreeError.textContent =
          "You must agree to the Terms and Privacy Policy.";
      ok = false;
    }

    if (ok) {
      const success = document.getElementById("registerSuccess");
      if (success)
        success.textContent =
          "Account created successfully (demo). Redirecting to login...";
      setTimeout(() => (window.location.href = "login.html"), 900);
      registerForm.reset();
    }
  });
}
*/


// ---------- LOGIN ----------
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  // Prefill remembered email
  const savedEmail = localStorage.getItem("tb_email");
  if (savedEmail) loginForm.elements["email"].value = savedEmail;

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors(loginForm);

    const email = loginForm.elements["email"];
    const password = loginForm.elements["password"];
    const remember = loginForm.elements["remember"];

    let ok = true;

    if (!email.value.trim() || !isValidEmail(email.value.trim())) {
      setFieldError(email, "Enter a valid email address.");
      ok = false;
    }

    if (!password.value || password.value.length < 8) {
      setFieldError(password, "Password must be at least 8 characters.");
      ok = false;
    }

    if (ok) {
      if (remember.checked) {
        localStorage.setItem("tb_email", email.value.trim());
      } else {
        localStorage.removeItem("tb_email");
      }

      const success = document.getElementById("loginSuccess");
      if (success)
        success.textContent = "Login successful (demo). Redirecting...";
      setTimeout(() => {
        // later we'll change this to resident/dashboard.html
        window.location.href = "../resident/dashboard.html";
      }, 900);
    }
  });

  // Toggle password visibility
  const toggleBtn = document.getElementById("toggleLoginPassword");
  const passInput = document.getElementById("loginPassword");

  if (toggleBtn && passInput) {
    toggleBtn.addEventListener("click", () => {
      const isHidden = passInput.type === "password";
      passInput.type = isHidden ? "text" : "password";
      toggleBtn.textContent = isHidden ? "🙈" : "👁";
      toggleBtn.setAttribute(
        "aria-label",
        isHidden ? "Hide password" : "Show password",
      );
    });
  }
}

// ---------- RESET PASSWORD ----------
const resetForm = document.getElementById("resetForm");

if (resetForm) {
  resetForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors(resetForm);

    const email = resetForm.elements["email"];
    let ok = true;

    if (!email.value.trim() || !isValidEmail(email.value.trim())) {
      setFieldError(email, "Enter a valid email address.");
      ok = false;
    }

    if (ok) {
      // Demo flow: save email then go to OTP screen
      localStorage.setItem("tb_reset_email", email.value.trim());

      const success = document.getElementById("resetSuccess");
      if (success) success.textContent = "OTP sent (demo). Redirecting...";

      setTimeout(() => {
        window.location.href = "otp.html";
      }, 900);
    }
  });
}

// ---------- OTP ----------
const otpForm = document.getElementById("otpForm");

function maskEmail(email) {
  if (!email || !email.includes("@")) return "";
  const [user, domain] = email.split("@");
  const start = user.slice(0, 3);
  const end = user.slice(-2);
  return `${start}${"*".repeat(Math.max(0, user.length - 5))}${end}@${domain}`;
}

if (otpForm) {
  const subtitle = document.getElementById("otpSubtitle");
  const savedResetEmail = localStorage.getItem("tb_reset_email");
  if (subtitle && savedResetEmail) {
    subtitle.textContent = `We’ve sent an OTP code to your email ${maskEmail(savedResetEmail)}. Enter the OTP code below to verify.`;
  }

  const inputs = Array.from(document.querySelectorAll(".otp-input"));
  const timerEl = document.getElementById("otpTimer");
  const otpError = document.getElementById("otpError");

  // only digits + auto focus next/back
  inputs.forEach((input, idx) => {
    input.addEventListener("input", (e) => {
      input.value = input.value.replace(/\D/g, "").slice(0, 1);
      if (input.value && inputs[idx + 1]) inputs[idx + 1].focus();
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !input.value && inputs[idx - 1]) {
        inputs[idx - 1].focus();
      }
      if (e.key === "ArrowLeft" && inputs[idx - 1]) inputs[idx - 1].focus();
      if (e.key === "ArrowRight" && inputs[idx + 1]) inputs[idx + 1].focus();
    });

    // paste support
    input.addEventListener("paste", (e) => {
      e.preventDefault();
      const paste = (e.clipboardData || window.clipboardData).getData("text");
      const digits = paste.replace(/\D/g, "").slice(0, 4).split("");
      digits.forEach((d, i) => {
        if (inputs[i]) inputs[i].value = d;
      });
      const lastFilled = Math.min(digits.length, 4) - 1;
      if (inputs[lastFilled]) inputs[lastFilled].focus();
    });
  });

  // start timer (55s)
  let timeLeft = 55;
  let timerId = null;

  function renderTimer() {
    if (!timerEl) return;
    timerEl.textContent = `${timeLeft}s`;
  }

  function startTimer() {
    renderTimer();
    timerId = setInterval(() => {
      timeLeft -= 1;
      renderTimer();
      if (timeLeft <= 0) {
        clearInterval(timerId);
        timerId = null;
        if (timerEl) {
          timerEl.textContent = "Resend";
          timerEl.classList.add("resend-link");
          timerEl.style.cursor = "pointer";
          timerEl.style.color = "#2f9e44";
        }
      }
    }, 1000);
  }

  startTimer();

  // resend
  if (timerEl) {
    timerEl.addEventListener("click", () => {
      if (timeLeft > 0) return;

      // demo resend
      timeLeft = 55;
      timerEl.classList.remove("resend-link");
      timerEl.style.cursor = "default";
      timerEl.style.color = "#dc2626";
      startTimer();
    });
  }

  otpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (otpError) otpError.textContent = "";

    const code = inputs.map((i) => i.value).join("");
    if (code.length < 4) {
      if (otpError) otpError.textContent = "Please enter the 4-digit code.";
      return;
    }

    // Demo rule: accept any 4 digits
    const success = document.getElementById("otpSuccess");
    if (success) success.textContent = "OTP verified (demo). Redirecting...";

    setTimeout(() => {
      // Next screen usually: create new password / success
      // For now redirect to login
      window.location.href = "login.html";
    }, 900);
  });

  // focus first box
  if (inputs[0]) inputs[0].focus();
}

// ---------- NEW PASSWORD ----------
const newPasswordForm = document.getElementById("newPasswordForm");

function hasNumberOrSymbol(str) {
  return /[\d\W]/.test(str);
}

function togglePassword(btnId, inputId) {
  const btn = document.getElementById(btnId);
  const input = document.getElementById(inputId);
  if (!btn || !input) return;

  btn.addEventListener("click", () => {
    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";
    btn.textContent = isHidden ? "🙈" : "👁";
    btn.setAttribute(
      "aria-label",
      isHidden ? "Hide password" : "Show password",
    );
  });
}

togglePassword("toggleNewPassword", "newPassword");
togglePassword("toggleConfirmNewPassword", "confirmNewPassword");

if (newPasswordForm) {
  newPasswordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors(newPasswordForm);

    const newPassword = newPasswordForm.elements["newPassword"];
    const confirmNewPassword = newPasswordForm.elements["confirmNewPassword"];

    let ok = true;

    if (!newPassword.value || newPassword.value.length < 8) {
      setFieldError(newPassword, "Password must be at least 8 characters.");
      ok = false;
    } else if (!hasNumberOrSymbol(newPassword.value)) {
      setFieldError(newPassword, "Include at least one number or symbol.");
      ok = false;
    }

    if (confirmNewPassword.value !== newPassword.value) {
      setFieldError(confirmNewPassword, "Passwords do not match.");
      ok = false;
    }

    if (ok) {
      // Demo: clear reset email so flow ends cleanly
      localStorage.removeItem("tb_reset_email");

      const success = document.getElementById("newPasswordSuccess");
      if (success)
        success.textContent =
          "Password updated successfully (demo). Redirecting...";

      setTimeout(() => {
        // If you create success.html later, change to "success.html"
        window.location.href = "success.html";
      }, 900);

      newPasswordForm.reset();
    }
  });
}

// ---------- VERIFY EMAIL (Signup OTP) ----------
const verifyEmailForm = document.getElementById("verifyEmailForm");

if (verifyEmailForm) {
  const inputs = Array.from(verifyEmailForm.querySelectorAll(".otp-input"));
  const timerEl = document.getElementById("verifyTimer");
  const resendLink = document.getElementById("verifyResendLink");
  const errEl = document.getElementById("verifyError");

  // OTP input behavior (same as otp.html)
  inputs.forEach((input, idx) => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/\D/g, "").slice(0, 1);
      if (input.value && inputs[idx + 1]) inputs[idx + 1].focus();
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !input.value && inputs[idx - 1])
        inputs[idx - 1].focus();
      if (e.key === "ArrowLeft" && inputs[idx - 1]) inputs[idx - 1].focus();
      if (e.key === "ArrowRight" && inputs[idx + 1]) inputs[idx + 1].focus();
    });

    input.addEventListener("paste", (e) => {
      e.preventDefault();
      const paste = (e.clipboardData || window.clipboardData).getData("text");
      const digits = paste.replace(/\D/g, "").slice(0, 4).split("");
      digits.forEach((d, i) => inputs[i] && (inputs[i].value = d));
      const last = Math.min(digits.length, 4) - 1;
      if (inputs[last]) inputs[last].focus();
    });
  });

  // Resend cooldown timer (55s)
  let timeLeft = 55;
  let timerId = null;

  function setResendEnabled(enabled) {
    if (!resendLink) return;
    resendLink.setAttribute("aria-disabled", enabled ? "false" : "true");
  }

  function renderTimer() {
    if (!timerEl) return;
    timerEl.textContent = `${timeLeft}s`;
  }

  function startCooldown() {
    setResendEnabled(false);
    timeLeft = 55;
    renderTimer();

    if (timerId) clearInterval(timerId);
    timerId = setInterval(() => {
      timeLeft -= 1;
      renderTimer();
      if (timeLeft <= 0) {
        clearInterval(timerId);
        timerId = null;
        if (timerEl) timerEl.textContent = "";
        setResendEnabled(true);
      }
    }, 1000);
  }

  startCooldown();

  if (resendLink) {
    resendLink.addEventListener("click", (e) => {
      e.preventDefault();
      // Demo resend – just restart cooldown
      startCooldown();
    });
  }

  verifyEmailForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (errEl) errEl.textContent = "";

    const code = inputs.map((i) => i.value).join("");
    if (code.length < 4) {
      if (errEl) errEl.textContent = "Please enter the 4-digit code.";
      return;
    }

    // Demo accept
    const success = document.getElementById("verifySuccess");
    if (success) success.textContent = "Email verified (demo). Redirecting...";

    setTimeout(() => {
      // after verification, typically go to login or onboarding
      window.location.href = "login.html";
    }, 900);
  });

  if (inputs[0]) inputs[0].focus();
}






// ---------- STAFF PROFILE ----------
const staffProfileForm = document.getElementById("staffProfileForm");

if (staffProfileForm) {
  const emailInput = document.getElementById("staffEmail");

  const picked =
    localStorage.getItem("tb_email") ||
    localStorage.getItem("tb_reset_email") ||
    "johndoe@gmail.com";

  if (emailInput) emailInput.value = picked;

  staffProfileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors(staffProfileForm);

    const fullName = staffProfileForm.elements["fullName"];
    const zone = staffProfileForm.elements["zone"];
    const city = staffProfileForm.elements["city"];

    let ok = true;

    if (!fullName.value.trim()) {
      setFieldError(fullName, "Full name is required.");
      ok = false;
    }
    if (!zone.value.trim()) {
      setFieldError(zone, "Zone/District is required.");
      ok = false;
    }
    if (!city.value.trim()) {
      setFieldError(city, "City/LGA is required.");
      ok = false;
    }

    if (ok) {
      const profile = {
        role: "staff",
        fullName: fullName.value.trim(),
        email: (emailInput && emailInput.value.trim()) || "",
        zone: zone.value.trim(),
        city: city.value.trim(),
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("tb_staff_profile", JSON.stringify(profile));

      const success = document.getElementById("staffProfileSuccess");
      if (success) success.textContent = "Profile saved (demo). Redirecting...";

      setTimeout(() => {
        // Later: route to staff dashboard
        window.location.href = "../admin/dashboard.html";
      }, 900);
    }
  });
}
