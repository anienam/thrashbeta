const form = document.getElementById("registerForm");

function setFieldError(field, message) {
  const wrapper = field.closest(".field");
  if (!wrapper) return;
  const error = wrapper.querySelector(".error");
  if (error) error.textContent = message;
}

function clearAllErrors() {
  document.querySelectorAll(".error").forEach((e) => (e.textContent = ""));
  const agreeError = document.getElementById("agreeError");
  if (agreeError) agreeError.textContent = "";
  const success = document.getElementById("registerSuccess");
  if (success) success.textContent = "";
}

function isValidEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearAllErrors();

    const firstName = form.elements["firstName"];
    const lastName = form.elements["lastName"];
    const email = form.elements["email"];
    const password = form.elements["password"];
    const confirmPassword = form.elements["confirmPassword"];
    const agree = form.elements["agree"];

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
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1200);
      form.reset();
    }
  });
}

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

// ---------- ONBOARDING (3 slides) ----------
const onboardNext = document.getElementById("onboardNext");

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
      window.location.href = "register.html";
    }
  });

  renderSlide(current);
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
  });

  roleContinue.addEventListener("click", () => {
    // store role for later routing
    localStorage.setItem("tb_role", selectedRole);

    // Demo routing:
    // Resident -> login or resident dashboard later
    // Staff -> login or staff dashboard later
    if (selectedRole === "resident") {
      window.location.href = "login.html";
    } else {
      window.location.href = "login.html";
    }
  });

  setSelected(selectedRole);
}

// ---------- RESIDENT PROFILE ----------
const residentProfileForm = document.getElementById("residentProfileForm");

if (residentProfileForm) {
  // Prefill email from remembered login/register/reset, whichever exists
  const emailInput = document.getElementById("residentEmail");

  const picked =
    localStorage.getItem("tb_email") ||
    localStorage.getItem("tb_reset_email") ||
    "johndoe@gmail.com";

  if (emailInput) emailInput.value = picked;

  residentProfileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors(residentProfileForm);

    const fullName = residentProfileForm.elements["fullName"];
    const area = residentProfileForm.elements["area"];
    const city = residentProfileForm.elements["city"];

    let ok = true;

    if (!fullName.value.trim()) {
      setFieldError(fullName, "Full name is required.");
      ok = false;
    }
    if (!area.value.trim()) {
      setFieldError(area, "Area/Neighborhood is required.");
      ok = false;
    }
    if (!city.value.trim()) {
      setFieldError(city, "City/LGA is required.");
      ok = false;
    }

    if (ok) {
      const profile = {
        role: "resident",
        fullName: fullName.value.trim(),
        email: (emailInput && emailInput.value.trim()) || "",
        phone: residentProfileForm.elements["phone"].value.trim(),
        area: area.value.trim(),
        city: city.value.trim(),
        address: residentProfileForm.elements["address"].value.trim(),
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("tb_profile", JSON.stringify(profile));

      const success = document.getElementById("profileSuccess");
      if (success) success.textContent = "Profile saved (demo). Redirecting...";

      setTimeout(() => {
        // Later: route to resident dashboard
        window.location.href = "../resident/dashboard.html";
      }, 900);
    }
  });
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
