//resident-report-flow.js

//const API = 'http://localhost:5000/api/v1';   // Development
const API = "https://trashbeta.onrender.com/api/v1"; // Production

function getCurrentStep() {
  return document.body?.dataset?.step;
}

const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");
const email = localStorage.getItem("email");
const role = localStorage.getItem("role");

/* =====================
   TOKEN CHECK & AUTO LOGOUT
===================== */

function clearUserSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("role");
  localStorage.removeItem("email");
  localStorage.removeItem("onboardingStep");
}

if (token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiryTime = payload.exp * 1000 - Date.now();

    if (expiryTime <= 0) {
      alert("Your session has expired. Please log in again.");
      clearUserSession();
      window.location.href = "../auth/login.html";
    } else {
      const MAX_TIMEOUT = 2147483647;
      setTimeout(
        () => {
          alert("Your session has expired. Please log in again.");
          clearUserSession();
          window.location.href = "../auth/login.html";
        },
        Math.min(expiryTime, MAX_TIMEOUT),
      );
    }
  } catch {
    alert("Invalid session. Please log in again.");
    clearUserSession();
    window.location.href = "../auth/login.html";
  }
} else {
  alert("Kindly login");
  clearUserSession();
  window.location.href = "../auth/login.html";
}



/* =====================
   LOAD LOGGED-IN USER
===================== */

async function loadLoggedInUser() {
  if (!token) return;

  try {
    const res = await fetch(`${API}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch user");

    const user = await res.json();

    injectUserIntoUI(user);

  } catch (err) {
    console.error("User load failed:", err.message);
  }
}




//function
function injectUserIntoUI(user) {
  if (!user) return;

  const nameEl = document.querySelector(".user-mini__name");
  if (nameEl) {
    nameEl.textContent =
      `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
  }

  const subEl = document.querySelector(".user-mini__sub");
  if (subEl) {
    subEl.textContent = user.email || "";
  }

  const sidebarAvatar = document.querySelector(".user-mini__avatar");
  if (sidebarAvatar && user.avatar) {
    sidebarAvatar.src = user.avatar;
  }

  const topbarAvatar = document.querySelector(".avatar-btn img");
  if (topbarAvatar && user.avatar) {
    topbarAvatar.src = user.avatar;
  }
}

loadLoggedInUser();

/* =====================
   REPORT STORAGE
===================== */

const STORAGE_KEY = "trashReportDraft";
let selectedImages = [];

function getDraft() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {};
}

function saveDraft(data) {
  const updated = { ...getDraft(), ...data };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

function goTo(page) {
  window.location.replace(page);
}




/* =====================
   WIZARD PAGE GUARD
===================== */

function wizardPageGuard() {
  const CURRENT_STEP = getCurrentStep();
  const draft = getDraft();

  if (!CURRENT_STEP) return;

  const stepRequirements = {
    2: ["category"],
    3: ["category", "state"],
    4: ["category", "state", "description"],
    5: ["category", "state", "description"],
  };

  const requiredFields = stepRequirements[CURRENT_STEP];

  if (!requiredFields) return;

  const isValid = requiredFields.every((field) => draft[field]);

  if (!isValid) {
    sessionStorage.removeItem(STORAGE_KEY);
    window.location.replace("resident-report-1-waste-type.html");
  }
}

wizardPageGuard();

window.addEventListener("pageshow", (event) => {
  if (event.persisted) wizardPageGuard();
});





/* =====================
   STEP 1
===================== */

const CATEGORY_MAP = {
  "illegal-dumping": "illegal",
  "overflowing-bin": "overflowing",
  "blocked-drainage": "blocked",
  "uncollected-waste": "missed",
  general: "general",
  burning: "burning",
  uncategorized: "uncategorized",
  others: "other",
};

const wasteTypeForm = document.getElementById("wasteTypeForm");

if (wasteTypeForm) {
  wasteTypeForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const uiCategory = document.getElementById("wasteType").value;
    const category = CATEGORY_MAP[uiCategory];

    saveDraft({ category });
    goTo("resident-report-2-location.html");
  });
}

/* =====================
   STEP 2
===================== */

const locationForm = document.getElementById("locationForm");

if (locationForm) {
  locationForm.addEventListener("submit", (e) => {
    e.preventDefault();

    saveDraft({
      state: document.getElementById("state").value,
      lga: document.getElementById("lga").value,
      address: document.getElementById("address").value,
    });

    goTo("resident-report-3-description.html");
  });
}

/* =====================
   STEP 3
===================== */

const descriptionForm = document.getElementById("descriptionForm");

if (descriptionForm) {
  descriptionForm.addEventListener("submit", (e) => {
    e.preventDefault();

    saveDraft({
      description: document.getElementById("issueDescription").value,
    });

    goTo("resident-report-4-photo.html");
  });
}




/* =====================
   STEP 4 (PHOTOS)
===================== */

const photoForm = document.getElementById("photoForm");

if (photoForm) {
  const input = document.getElementById("photoInput");
  const preview = document.getElementById("uploadsGrid");
  const addMoreBtn = document.getElementById("addMoreBtn");
  const chooseGalleryBtn = document.getElementById("chooseGalleryBtn");

  chooseGalleryBtn.onclick = () => input.click();

  const draft = getDraft();
  selectedImages = draft.images || [];

  renderImages();

  input.addEventListener("change", () => {
    handleFiles([...input.files]);
  });

  async function handleFiles(files) {
    const MAX_IMAGES = 5;

    if (selectedImages.length + files.length > MAX_IMAGES) {
      alert(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;

      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is larger than 5MB`);
        continue;
      }

      const base64 = await fileToBase64(file);

      selectedImages.push({
        name: file.name,
        type: file.type,
        data: base64,
      });
    }

    saveDraft({ images: selectedImages });
    renderImages();
  }

  function renderImages() {
    preview.innerHTML = "";

    selectedImages.forEach((imgObj, index) => {
      const card = document.createElement("div");
      card.className = "upload-card";

      const img = document.createElement("img");
      img.src = imgObj.data;

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "✕";

      deleteBtn.onclick = () => {
        if (!confirm("Remove this image?")) return;

        selectedImages.splice(index, 1);
        saveDraft({ images: selectedImages });
        renderImages();
      };

      const replaceBtn = document.createElement("button");
      replaceBtn.className = "replace-btn";
      replaceBtn.textContent = "Replace";

      replaceBtn.onclick = () => {
        const tempInput = document.createElement("input");
        tempInput.type = "file";
        tempInput.accept = "image/*";

        tempInput.onchange = async () => {
          const file = tempInput.files[0];
          if (!file) return;

          if (file.size > 5 * 1024 * 1024) {
            alert("Image must be less than 5MB");
            return;
          }

          const base64 = await fileToBase64(file);

          selectedImages[index] = {
            name: file.name,
            type: file.type,
            data: base64,
          };

          saveDraft({ images: selectedImages });
          renderImages();
        };

        tempInput.click();
      };

      card.append(img, deleteBtn, replaceBtn);
      preview.appendChild(card);
    });

    if (addMoreBtn) preview.appendChild(addMoreBtn);
  }

  function fileToBase64(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }

  photoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    goTo("resident-report-5-contact.html");
  });
}




/* =====================
   STEP 4 EXTRA BUTTONS
===================== */

if (photoForm) {

  const takePhotoBtn = document.getElementById("takePhotoBtn");
  const chooseGalleryBtn = document.getElementById("chooseGalleryBtn");
  const addMoreBtn = document.getElementById("addMoreBtn");
  const cameraInput = document.getElementById("cameraInput");
  const galleryInput = document.getElementById("galleryInput");

  if (takePhotoBtn && cameraInput) {
    takePhotoBtn.addEventListener("click", () => {
      cameraInput.click();
    });
  }

  if (chooseGalleryBtn && galleryInput) {
    chooseGalleryBtn.addEventListener("click", () => {
      galleryInput.click();
    });
  }

  if (addMoreBtn && galleryInput) {
    addMoreBtn.addEventListener("click", () => {
      galleryInput.click();
    });
  }

  if (cameraInput) {
    cameraInput.addEventListener("change", (e) => {
      if (e.target.files.length) {
        handleFiles([...e.target.files]);
      }
      e.target.value = "";
    });
  }

  if (galleryInput) {
    galleryInput.addEventListener("change", (e) => {
      if (e.target.files.length) {
        handleFiles([...e.target.files]);
      }
      e.target.value = "";
    });
  }
}






/* =====================
   STEP 5 (CONTACT + SUBMIT)
===================== */

const contactForm = document.getElementById("contactForm");
let selectedPreference = "BOTH"; // default matches UI

if (contactForm) {
  // ===== Prefill user data =====
  const firstName = localStorage.getItem("firstName") || "";
  const lastName = localStorage.getItem("lastName") || "";

  document.getElementById("previewName").value =
    `${firstName} ${lastName}`.trim();

  document.getElementById("previewEmail").value =
    localStorage.getItem("email") || "";

  document.getElementById("previewPhone").value =
    localStorage.getItem("phone") || "";

  // ===== NOTIFICATION PREFERENCE (FIXED LOCATION) =====
  const updateCards = document.querySelectorAll(".update-card");

  updateCards.forEach((card) => {
    card.addEventListener("click", () => {
      // Remove selection from all
      updateCards.forEach((c) => {
        c.classList.remove("is-selected");
        c.setAttribute("aria-checked", "false");
      });

      // Add selection to clicked
      card.classList.add("is-selected");
      card.setAttribute("aria-checked", "true");

      const pref = card.dataset.pref;

      if (pref === "email") selectedPreference = "EMAIL";
      if (pref === "sms") selectedPreference = "SMS";
      if (pref === "both") selectedPreference = "BOTH";
    });
  });

  // ===== FORM SUBMIT =====
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const draft = getDraft();

    try {
      const formData = new FormData();

      formData.append("category", draft.category);
      formData.append("state", draft.state);
      formData.append("lga", draft.lga);
      formData.append("address", draft.address);
      formData.append("description", draft.description || "");
      formData.append("notificationPreference", selectedPreference);

      (draft.images || []).forEach((img) => {
        const file = base64ToFile(img.data, img.name, img.type);
        formData.append("images", file);
      });

      const res = await fetch(`${API}/reports`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.setItem("trackingId", data.report.trackingId);

      window.location.replace("resident-report-success.html");
    } catch (err) {
      alert(err.message);
    }
  });
}

// ===== Helper =====
function base64ToFile(base64, name, type) {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);

  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], name, { type: mime });
}

/* =====================
   SUCCESS PAGE TRACKING
===================== */

const trackingEl = document.getElementById("trackingId");

if (trackingEl) {
  const id = sessionStorage.getItem("trackingId");

  if (!id) {
    window.location.replace("resident-report-1-waste-type.html");
  } else {
    trackingEl.textContent = id;
  }
}


