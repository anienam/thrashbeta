(() => {
  const $ = (q) => document.querySelector(q);

  const tabs = document.querySelectorAll(".tab-pill");
  const panels = document.querySelectorAll(".panel");

  const topAvatar = $("#topAvatar");
  const profileAvatar = $("#profileAvatar");

  const displayName = $("#displayName");
  const displayEmail = $("#displayEmail");
  const memberSince = $("#memberSince");

  const form = $("#profileForm");
  const saveMsg = $("#saveMsg");

  const fullName = $("#fullName");
  const email = $("#email");
  const phone = $("#phone");
  const address = $("#address");
  const lga = $("#lga");

  const cancelBtn = $("#cancelBtn");

  const changePhotoBtn = $("#changePhotoBtn");
  const photoInput = $("#photoInput");

  const STORAGE_KEY = "resident_profile";

  const defaultProfile = {
    fullName: "Abdul Whareez",
    email: "whareezdesigns@gmail.com",
    phone: "080 1234 7835",
    address: "",
    lga: "Ikeja",
    memberSince: "Oct 2025",
    photo:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=240&q=60",
  };

  function safeGet() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultProfile;
    } catch {
      return defaultProfile;
    }
  }

  function setProfileUI(p) {
    displayName.textContent = p.fullName || "—";
    displayEmail.textContent = p.email || "—";
    memberSince.textContent = `Member since ${p.memberSince || "—"}`;

    profileAvatar.src = p.photo || defaultProfile.photo;
    topAvatar.src = p.photo || defaultProfile.photo;

    fullName.value = p.fullName || "";
    email.value = p.email || "";
    phone.value = p.phone || "";
    address.value = p.address || "";
    lga.value = p.lga || "";
  }

  function saveProfile(p) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  }

  function currentFormProfile(existing) {
    return {
      ...existing,
      fullName: fullName.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      address: address.value.trim(),
      lga: lga.value,
    };
  }

  // Tabs
  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabs.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      const tab = btn.dataset.tab;
      panels.forEach((p) =>
        p.classList.toggle("is-active", p.dataset.panel === tab),
      );
    });
  });

  // Save
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const prev = safeGet();
    const next = currentFormProfile(prev);

    // light validation
    if (!next.fullName) {
      saveMsg.style.color = "#b91c1c";
      saveMsg.textContent = "Full name is required.";
      return;
    }
    if (!next.email || !next.email.includes("@")) {
      saveMsg.style.color = "#b91c1c";
      saveMsg.textContent = "Enter a valid email address.";
      return;
    }

    saveProfile(next);
    setProfileUI(next);

    saveMsg.style.color = "#2f7d32";
    saveMsg.textContent = "Changes saved successfully.";
    setTimeout(() => (saveMsg.textContent = ""), 2500);
  });

  // Cancel = reset to saved
  cancelBtn.addEventListener("click", () => {
    const p = safeGet();
    setProfileUI(p);
    saveMsg.textContent = "";
  });

  // Change photo
  changePhotoBtn.addEventListener("click", () => {
    photoInput.click();
  });

  photoInput.addEventListener("change", () => {
    const file = photoInput.files && photoInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const p = safeGet();
      const next = { ...p, photo: reader.result };
      saveProfile(next);
      setProfileUI(next);

      saveMsg.style.color = "#2f7d32";
      saveMsg.textContent = "Profile photo updated.";
      setTimeout(() => (saveMsg.textContent = ""), 2500);
    };
    reader.readAsDataURL(file);
  });

  // Init
  const p = safeGet();
  setProfileUI(p);
})();
