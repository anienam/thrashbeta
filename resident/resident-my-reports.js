const body = document.getElementById("reportsBody");
const tabs = document.querySelectorAll(".tab");
const searchInput = document.getElementById("searchInput");
const tableInfo = document.getElementById("tableInfo");

let currentStatus = "all";

function getReports() {
  return JSON.parse(localStorage.getItem("resident_reports") || "[]");
}

function renderReports() {
  const reports = getReports().filter((r) => {
    if (currentStatus !== "all" && r.status !== currentStatus) return false;

    const q = searchInput.value.toLowerCase();
    return (
      r.id.toLowerCase().includes(q) ||
      r.wasteType.toLowerCase().includes(q) ||
      r.lga.toLowerCase().includes(q)
    );
  });

  body.innerHTML = "";
  tableInfo.textContent = `Showing ${reports.length} reports`;

  reports.forEach((r) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td class="photo-cell">
        <img src="${r.photos?.[0] || "https://via.placeholder.com/80"}" />
      </td>
      <td>${r.id}</td>
      <td>${r.wasteType}</td>
      <td>${r.lga}</td>
      <td>${new Date(r.createdAt).toDateString()}</td>
      <td><span class="badge ${r.priority}">${r.priority}</span></td>
      <td><span class="badge status ${r.status}">${r.status.replace("_", " ")}</span></td>
      <td class="menu">⋮</td>
    `;

    tr.addEventListener("click", () => {
      window.location.href = `resident-track-issue.html?tid=${r.id}`;
    });

    body.appendChild(tr);
  });
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    currentStatus = tab.dataset.status;
    renderReports();
  });
});

searchInput.addEventListener("input", renderReports);

renderReports();
