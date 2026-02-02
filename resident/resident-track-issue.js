(() => {
  const $ = (q) => document.querySelector(q);

  const input = $("#trackingInput");
  const trackBtn = $("#trackBtn");
  const notFoundMsg = $("#notFoundMsg");

  const statusPill = $("#statusPill");
  const priorityPill = $("#priorityPill");
  const statusPill2 = $("#statusPill2");
  const priorityPill2 = $("#priorityPill2");

  const etaText = $("#etaText");
  const timeline = $("#timeline");

  const locTitle = $("#locTitle");
  const locAddress = $("#locAddress");
  const submittedDate = $("#submittedDate");

  const photosCard = $("#photosCard");
  const photosGrid = $("#photosGrid");

  const contactSupportBtn = $("#contactSupportBtn");
  const shareBtn = $("#shareBtn");
  const downloadBtn = $("#downloadBtn");

  function safeJSON(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch {
      return fallback;
    }
  }

  function formatDate(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    // Example: Jan 10 2026 at 2:30PM
    const mon = d.toLocaleString(undefined, { month: "short" });
    const day = d.getDate();
    const year = d.getFullYear();
    const time = d.toLocaleString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
    return `${mon} ${day} ${year} at ${time}`;
  }

  function normalizeStatus(s) {
    const v = (s || "").toLowerCase();
    if (v.includes("complete")) return "completed";
    if (v.includes("progress")) return "in_progress";
    return "pending";
  }

  function normalizePriority(p) {
    const v = (p || "").toLowerCase();
    if (v.includes("high")) return "high";
    if (v.includes("medium")) return "medium";
    return "low";
  }

  function setPills(statusText, priorityText) {
    const sKey = normalizeStatus(statusText);
    const pKey = normalizePriority(priorityText);

    [statusPill, statusPill2].forEach((el) => {
      el.textContent = statusText || "Pending";
      el.dataset.status = sKey;
    });

    [priorityPill, priorityPill2].forEach((el) => {
      el.textContent = priorityText || "Low";
      el.dataset.priority = pKey;
    });
  }

  function buildTimeline(report) {
    // Base steps like your design
    const steps = [
      {
        key: "received",
        title: "Report Received:",
        highlight: report.wasteType || "Waste Issue",
        time: report.createdAt ? formatDate(report.createdAt) : "",
        desc: "Your report was successfully submitted.",
      },
      {
        key: "review",
        title: "Under Review",
        highlight: "",
        time: report.reviewedAt ? formatDate(report.reviewedAt) : "",
        desc: "Our team is reviewing your submission",
      },
      {
        key: "assigned",
        title: "Assigned to Worker",
        highlight: report.workerName
          ? `Field Worker: ${report.workerName}`
          : "",
        time: report.assignedAt ? formatDate(report.assignedAt) : "",
        desc: report.workerName ? "" : "A worker will be assigned shortly.",
      },
      {
        key: "started",
        title: "Work Started",
        highlight: "",
        time: report.workStartedAt ? formatDate(report.workStartedAt) : "",
        desc: "Worker is resolving the issue.",
      },
      {
        key: "completed",
        title: "Completed",
        highlight: "",
        time: report.completedAt ? formatDate(report.completedAt) : "",
        desc: "The worker has successfully resolved the issue",
      },
    ];

    // Decide progress index from status
    const statusKey = normalizeStatus(report.status);
    let currentIndex = 0;

    if (statusKey === "completed") currentIndex = 4;
    else {
      // If in progress, show through "assigned" or "started" depending if we have those timestamps
      if (report.workStartedAt) currentIndex = 3;
      else if (report.assignedAt || report.workerName) currentIndex = 2;
      else if (report.reviewedAt) currentIndex = 1;
      else currentIndex = 0;
    }

    timeline.innerHTML = "";

    steps.forEach((s, idx) => {
      const item = document.createElement("div");
      item.className = "t-item";

      if (idx < currentIndex) item.classList.add("is-done");
      if (idx === currentIndex) item.classList.add("is-current");
      if (idx === 0 && currentIndex > 0) item.classList.add("is-done");

      const dot = document.createElement("div");
      dot.className = "t-dot";
      dot.textContent =
        idx < currentIndex || (idx === currentIndex && currentIndex === 4)
          ? "✓"
          : "✓";

      // For pending ones, show empty circle vibe
      if (idx > currentIndex) {
        dot.textContent = "✓";
        dot.style.opacity = "0.45";
      }

      const title = document.createElement("p");
      title.className = "t-title";
      title.innerHTML = `
        ${s.title}
        ${s.highlight ? `<span class="green">${s.highlight}</span>` : ""}
      `;

      const time = document.createElement("p");
      time.className = "t-time";
      time.textContent = s.time || "";

      const desc = document.createElement("p");
      desc.className = "t-desc";
      desc.textContent = s.desc || "";

      item.appendChild(dot);
      item.appendChild(title);
      if (s.time) item.appendChild(time);
      if (s.desc) item.appendChild(desc);

      // make pending look lighter
      if (idx > currentIndex) {
        title.style.opacity = "0.55";
        time.style.opacity = "0.55";
        desc.style.opacity = "0.55";
      }

      timeline.appendChild(item);
    });
  }

  function renderPhotos(report) {
    const photos = Array.isArray(report.photos) ? report.photos : [];
    if (!photos.length) {
      photosCard.style.display = "none";
      return;
    }

    photosCard.style.display = "block";
    photosGrid.innerHTML = "";

    photos.slice(0, 6).forEach((src) => {
      const wrap = document.createElement("div");
      wrap.className = "photo";

      const img = document.createElement("img");
      img.src = src;
      img.alt = "Reported photo";
      img.loading = "lazy";

      wrap.appendChild(img);
      photosGrid.appendChild(wrap);
    });
  }

  function renderReport(report) {
    notFoundMsg.textContent = "";

    setPills(report.status || "In Progress", report.priority || "Low");
    etaText.textContent = report.eta || "24 - 48 hours";

    const city = report.lga
      ? `${report.lga}, ${report.state || "Nigeria"}`
      : report.state || "Nigeria";
    locTitle.textContent = city;
    locAddress.textContent = report.address || "—";
    submittedDate.textContent = report.createdAt
      ? formatDate(report.createdAt)
      : "—";

    buildTimeline(report);
    renderPhotos(report);
  }

  function findReportById(trackingId) {
    const reports = safeJSON("resident_reports", []);
    return reports.find(
      (r) => (r.id || "").toLowerCase() === trackingId.toLowerCase(),
    );
  }

  function trackNow() {
    const id = (input.value || "").trim();
    if (!id) {
      notFoundMsg.textContent = "Please enter a tracking ID.";
      return;
    }

    const report = findReportById(id);
    if (!report) {
      notFoundMsg.textContent = "No report found with that Tracking ID.";
      // hide details/photos to avoid confusion
      timeline.innerHTML = "";
      photosGrid.innerHTML = "";
      photosCard.style.display = "none";
      return;
    }

    renderReport(report);
  }

  // Buttons
  trackBtn.addEventListener("click", trackNow);

  // Enter key triggers search
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      trackNow();
    }
  });

  // Right actions (safe placeholders)
  contactSupportBtn.addEventListener("click", () => {
    alert("Support will be connected here (chat/email/phone).");
  });

  shareBtn.addEventListener("click", async () => {
    const tid = (input.value || "").trim();
    const url = `${window.location.origin}${window.location.pathname}?tid=${encodeURIComponent(tid)}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "TrashBeta Report",
          text: `Tracking ID: ${tid}`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard.");
      }
    } catch {
      alert("Could not share right now.");
    }
  });

  downloadBtn.addEventListener("click", () => {
    alert("PDF download will be implemented here (server-generated PDF).");
  });

  // Auto-fill from URL (?tid=...)
  const url = new URL(window.location.href);
  const tid = url.searchParams.get("tid");
  if (tid) {
    input.value = tid;
    trackNow();
  } else {
    // Optional: prefill with most recent report
    const reports = safeJSON("resident_reports", []);
    if (reports[0]?.id) input.value = reports[0].id;
  }
})();
