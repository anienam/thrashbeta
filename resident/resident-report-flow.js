(() => {
  const form = document.getElementById("wasteTypeForm");
  const wasteTypeSelect = document.getElementById("wasteType");

  // Restore saved value (if user comes back)
  const savedType = localStorage.getItem("report_waste_type");
  if (savedType) wasteTypeSelect.value = savedType;

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const value = wasteTypeSelect.value;
      if (!value) {
        alert("Please select a waste type to continue.");
        return;
      }

      localStorage.setItem("report_waste_type", value);

      // Go to step 2
      window.location.href = "resident-report-2-location.html";
    });
  }
})();

(() => {
  // ---------- helpers ----------
  const $ = (q) => document.querySelector(q);

  // ---------- STEP 1: Waste Type (custom select) ----------
  const wasteSelect = $("#wasteTypeSelect");
  const wasteForm = $("#wasteTypeForm");

  if (wasteSelect && wasteForm) {
    const trigger = wasteSelect.querySelector(".select-trigger");
    const valueEl = wasteSelect.querySelector(".select-value");
    const options = wasteSelect.querySelectorAll("li");

    // restore
    const savedLabel = localStorage.getItem("report_waste_type_label");
    const savedValue = localStorage.getItem("report_waste_type");
    if (savedLabel && savedValue) {
      valueEl.textContent = savedLabel;
      wasteSelect.classList.add("is-selected");
    }

    trigger.addEventListener("click", () =>
      wasteSelect.classList.toggle("is-open"),
    );

    options.forEach((opt) => {
      opt.addEventListener("click", () => {
        localStorage.setItem("report_waste_type", opt.dataset.value);
        localStorage.setItem("report_waste_type_label", opt.textContent);

        valueEl.textContent = opt.textContent;
        wasteSelect.classList.add("is-selected");
        wasteSelect.classList.remove("is-open");
      });
    });

    document.addEventListener("click", (e) => {
      if (!wasteSelect.contains(e.target))
        wasteSelect.classList.remove("is-open");
    });

    wasteForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!localStorage.getItem("report_waste_type")) {
        alert("Please select a waste type to continue.");
        return;
      }
      window.location.href = "resident-report-2-location.html";
    });
  }

  // ---------- STEP 2: Location ----------
  const locationForm = $("#locationForm");
  if (locationForm) {
    const stateEl = $("#state");
    const lgaEl = $("#lga");
    const addressEl = $("#address");
    const backBtn = $("#backBtn");

    // restore saved values
    const savedState = localStorage.getItem("report_state");
    const savedLga = localStorage.getItem("report_lga");
    const savedAddress = localStorage.getItem("report_address");

    if (savedState) stateEl.value = savedState;
    if (savedLga) lgaEl.value = savedLga;
    if (savedAddress) addressEl.value = savedAddress;

    if (backBtn) {
      backBtn.addEventListener("click", () => {
        window.location.href = "resident-report-1-waste-type.html";
      });
    }

    locationForm.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!stateEl.value || !lgaEl.value) {
        alert("Please select State and LGA to continue.");
        return;
      }

      localStorage.setItem("report_state", stateEl.value);
      localStorage.setItem("report_lga", lgaEl.value);
      localStorage.setItem("report_address", addressEl.value.trim());

      // next step
      window.location.href = "resident-report-3-description.html";
    });
  }
})();

(() => {
  const $ = (q) => document.querySelector(q);

  /* =========================
     STEP 1: Waste Type
     ========================= */
  const wasteSelect = $("#wasteTypeSelect");
  const wasteForm = $("#wasteTypeForm");

  if (wasteSelect && wasteForm) {
    const trigger = wasteSelect.querySelector(".select-trigger");
    const valueEl = wasteSelect.querySelector(".select-value");
    const options = wasteSelect.querySelectorAll("li");

    const savedLabel = localStorage.getItem("report_waste_type_label");
    const savedValue = localStorage.getItem("report_waste_type");
    if (savedLabel && savedValue) {
      valueEl.textContent = savedLabel;
      wasteSelect.classList.add("is-selected");
    }

    trigger.addEventListener("click", () =>
      wasteSelect.classList.toggle("is-open"),
    );

    options.forEach((opt) => {
      opt.addEventListener("click", () => {
        localStorage.setItem("report_waste_type", opt.dataset.value);
        localStorage.setItem("report_waste_type_label", opt.textContent);

        valueEl.textContent = opt.textContent;
        wasteSelect.classList.add("is-selected");
        wasteSelect.classList.remove("is-open");
      });
    });

    document.addEventListener("click", (e) => {
      if (!wasteSelect.contains(e.target))
        wasteSelect.classList.remove("is-open");
    });

    wasteForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!localStorage.getItem("report_waste_type")) {
        alert("Please select a waste type to continue.");
        return;
      }
      window.location.href = "resident-report-2-location.html";
    });
  }

  /* =========================
     STEP 2: Location
     ========================= */
  const locationForm = $("#locationForm");
  if (locationForm) {
    const stateEl = $("#state");
    const lgaEl = $("#lga");
    const addressEl = $("#address");
    const backBtn = $("#backBtn");

    const savedState = localStorage.getItem("report_state");
    const savedLga = localStorage.getItem("report_lga");
    const savedAddress = localStorage.getItem("report_address");

    if (savedState) stateEl.value = savedState;
    if (savedLga) lgaEl.value = savedLga;
    if (savedAddress) addressEl.value = savedAddress;

    backBtn?.addEventListener("click", () => {
      window.location.href = "resident-report-1-waste-type.html";
    });

    locationForm.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!stateEl.value || !lgaEl.value) {
        alert("Please select State and LGA to continue.");
        return;
      }

      localStorage.setItem("report_state", stateEl.value);
      localStorage.setItem("report_lga", lgaEl.value);
      localStorage.setItem("report_address", addressEl.value.trim());

      window.location.href = "resident-report-3-description.html";
    });
  }

  /* =========================
     STEP 3: Description
     ========================= */
  const descriptionForm = $("#descriptionForm");
  if (descriptionForm) {
    const backBtn = $("#backBtn");
    const descEl = $("#issueDescription");
    const charCount = $("#charCount");
    const MAX = 500;

    // restore
    const savedDesc = localStorage.getItem("report_description");
    if (savedDesc) {
      descEl.value = savedDesc;
    }

    function updateCount() {
      const len = descEl.value.length;
      charCount.textContent = String(len);

      // hard limit
      if (len > MAX) {
        descEl.value = descEl.value.slice(0, MAX);
        charCount.textContent = String(MAX);
      }
    }

    updateCount();
    descEl.addEventListener("input", updateCount);

    backBtn?.addEventListener("click", () => {
      window.location.href = "resident-report-2-location.html";
    });

    descriptionForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const text = descEl.value.trim();
      if (!text) {
        alert("Please enter a description to continue.");
        return;
      }

      localStorage.setItem("report_description", text);

      // next step
      window.location.href = "resident-report-4-photo.html";
    });
  }
})();

(() => {
  const $ = (q) => document.querySelector(q);

  /* =========================
     STEP 1: Waste Type
     ========================= */
  const wasteSelect = $("#wasteTypeSelect");
  const wasteForm = $("#wasteTypeForm");

  if (wasteSelect && wasteForm) {
    const trigger = wasteSelect.querySelector(".select-trigger");
    const valueEl = wasteSelect.querySelector(".select-value");
    const options = wasteSelect.querySelectorAll("li");

    const savedLabel = localStorage.getItem("report_waste_type_label");
    const savedValue = localStorage.getItem("report_waste_type");
    if (savedLabel && savedValue) {
      valueEl.textContent = savedLabel;
      wasteSelect.classList.add("is-selected");
    }

    trigger.addEventListener("click", () =>
      wasteSelect.classList.toggle("is-open"),
    );

    options.forEach((opt) => {
      opt.addEventListener("click", () => {
        localStorage.setItem("report_waste_type", opt.dataset.value);
        localStorage.setItem("report_waste_type_label", opt.textContent);

        valueEl.textContent = opt.textContent;
        wasteSelect.classList.add("is-selected");
        wasteSelect.classList.remove("is-open");
      });
    });

    document.addEventListener("click", (e) => {
      if (!wasteSelect.contains(e.target))
        wasteSelect.classList.remove("is-open");
    });

    wasteForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!localStorage.getItem("report_waste_type")) {
        alert("Please select a waste type to continue.");
        return;
      }
      window.location.href = "resident-report-2-location.html";
    });
  }

  /* =========================
     STEP 2: Location
     ========================= */
  const locationForm = $("#locationForm");
  if (locationForm) {
    const stateEl = $("#state");
    const lgaEl = $("#lga");
    const addressEl = $("#address");
    const backBtn = $("#backBtn");

    const savedState = localStorage.getItem("report_state");
    const savedLga = localStorage.getItem("report_lga");
    const savedAddress = localStorage.getItem("report_address");

    if (savedState) stateEl.value = savedState;
    if (savedLga) lgaEl.value = savedLga;
    if (savedAddress) addressEl.value = savedAddress;

    backBtn?.addEventListener("click", () => {
      window.location.href = "resident-report-1-waste-type.html";
    });

    locationForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!stateEl.value || !lgaEl.value) {
        alert("Please select State and LGA to continue.");
        return;
      }

      localStorage.setItem("report_state", stateEl.value);
      localStorage.setItem("report_lga", lgaEl.value);
      localStorage.setItem("report_address", addressEl.value.trim());

      window.location.href = "resident-report-3-description.html";
    });
  }

  /* =========================
     STEP 3: Description
     ========================= */
  const descriptionForm = $("#descriptionForm");
  if (descriptionForm) {
    const backBtn = $("#backBtn");
    const descEl = $("#issueDescription");
    const charCount = $("#charCount");
    const MAX = 500;

    const savedDesc = localStorage.getItem("report_description");
    if (savedDesc) descEl.value = savedDesc;

    function updateCount() {
      const len = descEl.value.length;
      if (len > MAX) descEl.value = descEl.value.slice(0, MAX);
      charCount.textContent = String(descEl.value.length);
    }

    updateCount();
    descEl.addEventListener("input", updateCount);

    backBtn?.addEventListener("click", () => {
      window.location.href = "resident-report-2-location.html";
    });

    descriptionForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = descEl.value.trim();
      if (!text) {
        alert("Please enter a description to continue.");
        return;
      }
      localStorage.setItem("report_description", text);
      window.location.href = "resident-report-4-photo.html";
    });
  }

  /* =========================
     STEP 4: Photo (optional)
     ========================= */
  const photoForm = $("#photoForm");
  if (photoForm) {
    const backBtn = $("#backBtn");
    const dropzone = $("#dropzone");
    const photoInput = $("#photoInput");
    const chooseBtn = $("#chooseGalleryBtn");
    const addMoreBtn = $("#addMoreBtn");
    const takePhotoBtn = $("#takePhotoBtn");
    const grid = $("#uploadsGrid");
    const errorEl = $("#photoError");
    const skipBtn = $("#skipBtn");

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const ACCEPTED = ["image/jpeg", "image/png"];

    // stored as base64 previews for prototype
    // (in real backend app, you'd upload to server instead)
    let photos = [];
    try {
      photos = JSON.parse(localStorage.getItem("report_photos") || "[]");
    } catch {
      photos = [];
    }

    function setError(msg = "") {
      if (errorEl) errorEl.textContent = msg;
    }

    function render() {
      // remove old preview cards (keep Add More button)
      const existing = grid.querySelectorAll(".upload-card");
      existing.forEach((el) => el.remove());

      photos.forEach((src, idx) => {
        const card = document.createElement("div");
        card.className = "upload-card";

        const img = document.createElement("img");
        img.src = src;
        img.alt = `Uploaded photo ${idx + 1}`;
        img.loading = "lazy";

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "remove-photo";
        btn.setAttribute("aria-label", "Remove photo");
        btn.textContent = "×";
        btn.addEventListener("click", () => {
          photos.splice(idx, 1);
          localStorage.setItem("report_photos", JSON.stringify(photos));
          render();
        });

        card.appendChild(img);
        card.appendChild(btn);

        // Insert before Add More button
        grid.insertBefore(card, addMoreBtn);
      });
    }

    async function fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    async function handleFiles(fileList) {
      setError("");

      const files = Array.from(fileList || []);
      if (!files.length) return;

      for (const file of files) {
        if (!ACCEPTED.includes(file.type)) {
          setError("Only JPG or PNG images are allowed.");
          continue;
        }

        if (file.size > MAX_SIZE) {
          setError(
            "One or more files exceed 5MB. Please upload smaller images.",
          );
          continue;
        }

        const base64 = await fileToBase64(file);
        photos.push(base64);
      }

      localStorage.setItem("report_photos", JSON.stringify(photos));
      render();
    }

    // Restore previews
    render();

    // Navigation
    backBtn?.addEventListener("click", () => {
      window.location.href = "resident-report-3-description.html";
    });

    skipBtn?.addEventListener("click", () => {
      // optional: keep photos as-is
      window.location.href = "resident-report-5-contact.html";
    });

    // Click dropzone to browse
    dropzone?.addEventListener("click", () => photoInput.click());
    chooseBtn?.addEventListener("click", () => photoInput.click());
    addMoreBtn?.addEventListener("click", () => photoInput.click());

    // Take photo (mobile camera)
    takePhotoBtn?.addEventListener("click", () => {
      photoInput.setAttribute("capture", "environment");
      photoInput.click();
      // remove capture after use so gallery still works
      setTimeout(() => photoInput.removeAttribute("capture"), 300);
    });

    photoInput?.addEventListener("change", async (e) => {
      await handleFiles(e.target.files);
      photoInput.value = "";
    });

    // Drag & drop
    dropzone?.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.classList.add("is-dragover");
    });

    dropzone?.addEventListener("dragleave", () => {
      dropzone.classList.remove("is-dragover");
    });

    dropzone?.addEventListener("drop", async (e) => {
      e.preventDefault();
      dropzone.classList.remove("is-dragover");
      await handleFiles(e.dataTransfer.files);
    });

    // Next
    photoForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // photos optional, so just proceed
      window.location.href = "resident-report-5-contact.html";
    });
  }
})();

/* =========================
     STEP 5: Contact
     ========================= */
const contactForm = $("#contactForm");
if (contactForm) {
  const backBtn = $("#backBtn");

  const fullName = $("#fullName");
  const phone = $("#phone");
  const email = $("#email");

  const nameErr = $("#nameErr");
  const phoneErr = $("#phoneErr");
  const emailErr = $("#emailErr");
  const submitHint = $("#submitHint");

  const cards = document.querySelectorAll(".update-card");
  let pref = localStorage.getItem("report_update_pref") || "both";

  // restore saved values if any
  const savedName = localStorage.getItem("report_full_name");
  const savedPhone = localStorage.getItem("report_phone");
  const savedEmail = localStorage.getItem("report_email");

  if (savedName) fullName.value = savedName;
  if (savedPhone) phone.value = savedPhone;
  if (savedEmail) email.value = savedEmail;

  function setPref(next) {
    pref = next;
    localStorage.setItem("report_update_pref", pref);

    cards.forEach((c) => {
      const selected = c.dataset.pref === pref;
      c.classList.toggle("is-selected", selected);
      c.setAttribute("aria-checked", selected ? "true" : "false");
    });
  }

  setPref(pref);

  cards.forEach((c) => {
    c.addEventListener("click", () => setPref(c.dataset.pref));
  });

  backBtn?.addEventListener("click", () => {
    window.location.href = "resident-report-4-photo.html";
  });

  function clearErrors() {
    nameErr.textContent = "";
    phoneErr.textContent = "";
    emailErr.textContent = "";
    submitHint.textContent = "";
  }

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  function normalizePhone(v) {
    return v.replace(/[^\d+]/g, "").trim();
  }

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    const nameVal = fullName.value.trim();
    const phoneVal = normalizePhone(phone.value);
    const emailVal = email.value.trim();

    let ok = true;

    if (!nameVal) {
      nameErr.textContent = "Full name is required.";
      ok = false;
    }

    if (!phoneVal || phoneVal.length < 8) {
      phoneErr.textContent = "Enter a valid phone number.";
      ok = false;
    }

    if (!emailVal || !isValidEmail(emailVal)) {
      emailErr.textContent = "Enter a valid email address.";
      ok = false;
    }

    if (!ok) return;

    // store contact info
    localStorage.setItem("report_full_name", nameVal);
    localStorage.setItem("report_phone", phoneVal);
    localStorage.setItem("report_email", emailVal);

    // create a report record (for My Reports page later)
    const report = {
      id: `WM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 90000) + 10000)}`,
      wasteType: localStorage.getItem("report_waste_type_label") || "",
      wasteTypeKey: localStorage.getItem("report_waste_type") || "",
      state: localStorage.getItem("report_state") || "",
      lga: localStorage.getItem("report_lga") || "",
      address: localStorage.getItem("report_address") || "",
      description: localStorage.getItem("report_description") || "",
      photos: (() => {
        try {
          return JSON.parse(localStorage.getItem("report_photos") || "[]");
        } catch {
          return [];
        }
      })(),
      contact: { name: nameVal, phone: phoneVal, email: emailVal, pref },
      status: "Pending",
      priority: "Low",
      createdAt: new Date().toISOString(),
    };

    let reports = [];
    try {
      reports = JSON.parse(localStorage.getItem("resident_reports") || "[]");
    } catch {
      reports = [];
    }
    reports.unshift(report);
    localStorage.setItem("resident_reports", JSON.stringify(reports));

    // clear flow draft (optional, but recommended after submit)
    const keysToClear = [
      "report_waste_type",
      "report_waste_type_label",
      "report_state",
      "report_lga",
      "report_address",
      "report_description",
      "report_photos",
      "report_update_pref",
    ];
    keysToClear.forEach((k) => localStorage.removeItem(k));

    submitHint.textContent = "Submitted successfully.";

    // redirect (change to your success page)
    setTimeout(() => {
      window.location.href = `resident-report-success.html?tid=${encodeURIComponent(report.id)}`;
    }, 500);
  });
}

// SUCCESS PAGE LOGIC

(() => {
  const trackingIdEl = document.getElementById("trackingId");
  const copyBtn = document.getElementById("copyBtn");
  const copyHint = document.getElementById("copyHint");

  const trackBtn = document.getElementById("trackBtn");
  const reportAnotherBtn = document.getElementById("reportAnotherBtn");
  const dashboardBtn = document.getElementById("dashboardBtn");

  // Pull from URL first, then fallback to last report
  const url = new URL(window.location.href);
  const tid = url.searchParams.get("tid");

  let trackingId = tid;

  if (!trackingId) {
    try {
      const reports = JSON.parse(
        localStorage.getItem("resident_reports") || "[]",
      );
      trackingId = reports?.[0]?.id || "WM-2025-00000";
    } catch {
      trackingId = "WM-2025-00000";
    }
  }

  trackingIdEl.textContent = trackingId;

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(trackingId);
      copyHint.textContent = "Tracking ID copied.";
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = trackingId;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      copyHint.textContent = "Tracking ID copied.";
    }

    setTimeout(() => (copyHint.textContent = ""), 1800);
  });

  // Routes (update to your actual pages)
  trackBtn.addEventListener("click", () => {
    // Example:
    // window.location.href = `resident-track-issue.html?tid=${encodeURIComponent(trackingId)}`;
    alert(`Go to Track Issue with ID: ${trackingId}`);
  });

  reportAnotherBtn.addEventListener("click", () => {
    window.location.href = "resident-report-1-waste-type.html";
  });

  dashboardBtn.addEventListener("click", () => {
    window.location.href = "resident-dashboard.html";
  });
})();

trackBtn.addEventListener("click", () => {
  window.location.href = `resident-track-issue.html?tid=${encodeURIComponent(trackingId)}`;
});
