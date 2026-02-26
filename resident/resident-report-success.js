//resident-report-success.js



if (!sessionStorage.getItem("trackingId")) {
  window.location.replace("resident-report-1-waste-type.html");
}

document.addEventListener("DOMContentLoaded", () => {
  const trackBtn = document.getElementById("trackBtn");
  const reportAnotherBtn = document.getElementById("reportAnotherBtn");

  // Track button → go to track issue page
  trackBtn?.addEventListener("click", () => {
    // If you want to auto-fill the tracking id later, we can pass it via querystring
    window.location.href = "./resident-track-issue.html";
  });

  // Report another → restart flow at step 1
  reportAnotherBtn?.addEventListener("click", () => {
    window.location.href = "./resident-report-1-waste-type.html";
  });
});



