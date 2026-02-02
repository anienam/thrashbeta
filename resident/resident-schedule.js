(() => {
  const $ = (q) => document.querySelector(q);

  const lgaFilter = $("#lgaFilter");
  const typeFilter = $("#typeFilter");
  const rangeFilter = $("#rangeFilter");

  const calendarViewBtn = $("#calendarViewBtn");
  const listViewBtn = $("#listViewBtn");
  const calendarWrap = $("#calendarWrap");
  const listWrap = $("#listWrap");
  const listBody = $("#listBody");

  const monthBtn = $("#monthBtn");
  const weekBtn = $("#weekBtn");

  const monthLabel = $("#monthLabel");
  const calendarGrid = $("#calendarGrid");
  const prevMonth = $("#prevMonth");
  const nextMonth = $("#nextMonth");
  const prevMini = $("#prevMini");
  const nextMini = $("#nextMini");

  // Demo schedule events (replace with API later)
  // type: general | recyclables | organic
  const events = [
    // January 2026 samples to match screenshot pattern
    { date: "2026-01-04", time: "8:00 AM", type: "general", lga: "Agege" },
    { date: "2026-01-06", time: "8:00 AM", type: "organic", lga: "Ikeja" },
    {
      date: "2026-01-09",
      time: "8:00 AM",
      type: "recyclables",
      lga: "Surulere",
    },
    { date: "2026-01-11", time: "8:00 AM", type: "general", lga: "Agege" },
    { date: "2026-01-13", time: "8:00 AM", type: "organic", lga: "Ikeja" },
    {
      date: "2026-01-16",
      time: "8:00 AM",
      type: "recyclables",
      lga: "Surulere",
    },
    { date: "2026-01-18", time: "8:00 AM", type: "general", lga: "Agege" },
    { date: "2026-01-20", time: "8:00 AM", type: "organic", lga: "Ikeja" },
    {
      date: "2026-01-23",
      time: "8:00 AM",
      type: "recyclables",
      lga: "Surulere",
    },
    { date: "2026-01-25", time: "8:00 AM", type: "general", lga: "Agege" },
    { date: "2026-01-27", time: "8:00 AM", type: "organic", lga: "Ikeja" },
    {
      date: "2026-01-30",
      time: "8:00 AM",
      type: "recyclables",
      lga: "Surulere",
    },

    // show a couple "out-of-month" cells (Dec 2025 / Feb 2026) like screenshot
    { date: "2025-12-28", time: "8:00 AM", type: "general", lga: "Agege" },
    { date: "2025-12-30", time: "8:00 AM", type: "organic", lga: "Ikeja" },
    {
      date: "2026-01-02",
      time: "8:00 AM",
      type: "recyclables",
      lga: "Surulere",
    },
    { date: "2026-02-03", time: "8:00 AM", type: "organic", lga: "Ikeja" },
    {
      date: "2026-02-06",
      time: "8:00 AM",
      type: "recyclables",
      lga: "Surulere",
    },
  ];

  let viewMode = "calendar"; // calendar | list
  let periodMode = "month"; // month | week
  let current = new Date(2026, 0, 1); // Jan 2026

  function fmtMonthYear(d) {
    return d.toLocaleString(undefined, { month: "long", year: "numeric" });
  }

  function ymd(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function parseYMD(s) {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  function getFilteredEvents() {
    const lga = lgaFilter.value;
    const type = typeFilter.value;

    return events.filter((e) => {
      if (lga && e.lga !== lga) return false;
      if (type && e.type !== type) return false;
      return true;
    });
  }

  function eventUI(e) {
    const cls =
      e.type === "general"
        ? "event--green"
        : e.type === "recyclables"
          ? "event--blue"
          : "event--orange";

    const icon =
      e.type === "general" ? "🗑" : e.type === "recyclables" ? "♻" : "🍃";

    return `<div class="event ${cls}" title="${e.lga} • ${e.time}">
      <span class="bin">${icon}</span>
      <span>${e.time}</span>
    </div>`;
  }

  function renderMonth() {
    monthLabel.textContent = fmtMonthYear(current);

    const year = current.getFullYear();
    const month = current.getMonth();

    const first = new Date(year, month, 1);
    const startDay = first.getDay(); // Sun=0
    const start = new Date(year, month, 1 - startDay);

    const gridDays = 42; // 6 weeks
    const filtered = getFilteredEvents();

    calendarGrid.innerHTML = "";

    for (let i = 0; i < gridDays; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);

      const isOut = d.getMonth() !== month;

      const cell = document.createElement("div");
      cell.className = "cell" + (isOut ? " is-out" : "");

      const num = document.createElement("div");
      num.className = "day-num";
      num.textContent = d.getDate();

      const dayEvents = filtered.filter((e) => e.date === ymd(d));

      cell.appendChild(num);

      if (dayEvents.length) {
        // only show first event in month grid (matches screenshot)
        cell.insertAdjacentHTML("beforeend", eventUI(dayEvents[0]));
      }

      calendarGrid.appendChild(cell);
    }
  }

  function renderWeek() {
    // week = the week containing "current" date
    const d = new Date(current);
    const dow = d.getDay();
    const start = new Date(d);
    start.setDate(d.getDate() - dow);

    monthLabel.textContent = fmtMonthYear(current);

    const filtered = getFilteredEvents();
    calendarGrid.innerHTML = "";

    // 7 day cells only
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);

      const cell = document.createElement("div");
      cell.className = "cell";

      const num = document.createElement("div");
      num.className = "day-num";
      num.textContent = day.getDate();

      const dayEvents = filtered.filter((e) => e.date === ymd(day));

      cell.appendChild(num);

      // show up to 2 in week mode
      dayEvents.slice(0, 2).forEach((ev) => {
        cell.insertAdjacentHTML("beforeend", eventUI(ev));
      });

      calendarGrid.appendChild(cell);
    }
  }

  function renderList() {
    const filtered = getFilteredEvents()
      .map((e) => ({ ...e, _d: parseYMD(e.date) }))
      .sort((a, b) => a._d - b._d);

    listBody.innerHTML = "";

    filtered.forEach((e) => {
      const date = e._d.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const type =
        e.type === "general"
          ? "General Waste"
          : e.type === "recyclables"
            ? "Recyclables"
            : "Organic Waste";

      const row = document.createElement("div");
      row.className = "list-row";
      row.innerHTML = `
        <div>${date}</div>
        <div>${e.time}</div>
        <div>${type}</div>
        <div>${e.lga}</div>
      `;
      listBody.appendChild(row);
    });
  }

  function render() {
    if (viewMode === "calendar") {
      listWrap.hidden = true;
      calendarWrap.hidden = false;

      if (periodMode === "month") renderMonth();
      else renderWeek();
    } else {
      calendarWrap.hidden = true;
      listWrap.hidden = false;
      renderList();
    }
  }

  // View toggle
  calendarViewBtn.addEventListener("click", () => {
    viewMode = "calendar";
    calendarViewBtn.classList.add("is-active");
    listViewBtn.classList.remove("is-active");
    render();
  });

  listViewBtn.addEventListener("click", () => {
    viewMode = "list";
    listViewBtn.classList.add("is-active");
    calendarViewBtn.classList.remove("is-active");
    render();
  });

  // Mode toggle
  monthBtn.addEventListener("click", () => {
    periodMode = "month";
    monthBtn.classList.add("is-active");
    weekBtn.classList.remove("is-active");
    render();
  });

  weekBtn.addEventListener("click", () => {
    periodMode = "week";
    weekBtn.classList.add("is-active");
    monthBtn.classList.remove("is-active");
    render();
  });

  // Month nav
  prevMonth.addEventListener("click", () => {
    if (periodMode === "month")
      current = new Date(current.getFullYear(), current.getMonth() - 1, 1);
    else current.setDate(current.getDate() - 7);
    render();
  });

  nextMonth.addEventListener("click", () => {
    if (periodMode === "month")
      current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    else current.setDate(current.getDate() + 7);
    render();
  });

  // Mini nav (same behavior as screenshot right arrows)
  prevMini.addEventListener("click", () => prevMonth.click());
  nextMini.addEventListener("click", () => nextMonth.click());

  // Filters
  [lgaFilter, typeFilter, rangeFilter].forEach((el) => {
    el.addEventListener("change", () => {
      // rangeFilter is UI-only for now (can be used when you have real data)
      render();
    });
  });

  // initial
  render();
})();
