// const toggle = document.getElementById("menuToggle");
// const navLinks = document.querySelector(".nav-links");

// toggle.addEventListener("click", () => {
//   navLinks.style.display = navLinks.style.display === "flex" ? "none" : "flex";
// });

// Placeholder for future interactions
console.log("TrashBeta Homepage Loaded");

// FAQ Accordion
const faqButtons = document.querySelectorAll(".faq-item");

faqButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const answer = btn.nextElementSibling;
    const isOpen = answer.classList.contains("open");

    // close all
    document
      .querySelectorAll(".faq-answer")
      .forEach((a) => a.classList.remove("open"));
    document.querySelectorAll(".faq-item").forEach((b) => {
      b.setAttribute("aria-expanded", "false");
      const t = b.querySelector(".faq-toggle");
      if (t) t.textContent = "+";
    });

    // open current if it was closed
    if (!isOpen) {
      answer.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
      const toggle = btn.querySelector(".faq-toggle");
      if (toggle) toggle.textContent = "−";
    }
  });
});

// Contact Form Validation (simple)
const contactForm = document.getElementById("contactForm");

function setError(field, message) {
  const wrapper = field.closest(".field");
  if (!wrapper) return;
  const error = wrapper.querySelector(".error");
  if (error) error.textContent = message;
}

function clearErrors() {
  document.querySelectorAll(".error").forEach((e) => (e.textContent = ""));
  const agreeError = document.getElementById("agreeError");
  if (agreeError) agreeError.textContent = "";
  const success = document.getElementById("formSuccess");
  if (success) success.textContent = "";
}

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    const data = new FormData(contactForm);
    const fullName = data.get("fullName")?.trim();
    const email = data.get("email")?.trim();
    const subject = data.get("subject")?.trim();
    const message = data.get("message")?.trim();
    const agree = contactForm.elements["agree"]?.checked;

    let ok = true;

    if (!fullName) {
      setError(
        contactForm.elements["fullName"],
        "Please enter your full name.",
      );
      ok = false;
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError(
        contactForm.elements["email"],
        "Please enter a valid email address.",
      );
      ok = false;
    }

    if (!subject) {
      setError(contactForm.elements["subject"], "Please select a subject.");
      ok = false;
    }

    if (!message || message.length < 10) {
      setError(
        contactForm.elements["message"],
        "Please enter a message (at least 10 characters).",
      );
      ok = false;
    }

    if (!agree) {
      const agreeError = document.getElementById("agreeError");
      if (agreeError)
        agreeError.textContent = "You must agree to the privacy policy.";
      ok = false;
    }

    if (ok) {
      const success = document.getElementById("formSuccess");
      if (success)
        success.textContent =
          "Message sent successfully. We’ll get back to you within 24 hours.";
      contactForm.reset();
    }
  });
}
