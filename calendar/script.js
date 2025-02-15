/***********************************
  1. LOAD ENTRIES & PARSE THEM
************************************/
function loadJournalEntries() {
    const entries = JSON.parse(localStorage.getItem("journalEntries")) || [];
    return entries;
  }
  
  /***********************************
    2. COMPUTE TOTAL & STREAK
  ************************************/
  function computeStats(entries) {
    // Total journals is just the length
    const totalJournals = entries.length;
  
    // For streak, we do a simple approach:
    //  - Sort entries by date descending
    //  - Starting from the most recent date, count consecutive days
    //    that have an entry.
    const sorted = entries.slice().sort((a, b) => b.date.localeCompare(a.date));
  
    let streak = 0;
    if (sorted.length > 0) {
      // Start from the last entry's date
      let currentDate = new Date(sorted[0].date);
  
      streak = 1; // we have at least one day with an entry
      for (let i = 1; i < sorted.length; i++) {
        const nextDate = new Date(sorted[i].date);
  
        // Check if nextDate is exactly 1 day before currentDate
        const diff = (currentDate - nextDate) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          // consecutive day
          streak++;
          currentDate = nextDate; // move on
        } else {
          // streak breaks
          break;
        }
      }
    }
  
    return { totalJournals, streak };
  }
  
  /***********************************
    3. RENDER A MONTHLY CALENDAR
  ************************************/
  function renderCalendar(entries) {
    const calendarGrid = document.getElementById("calendarGrid");
  
    // We’ll just show the current month
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-based
  
    // 1) First day of the month
    const firstOfMonth = new Date(year, month, 1);
    // 2) Last day of the month
    const lastOfMonth = new Date(year, month + 1, 0); // day 0 of next month
    const daysInMonth = lastOfMonth.getDate();
  
    // 3) Which weekday is the first? (0=Sun,1=Mon,...6=Sat)
    const startDay = firstOfMonth.getDay();
  
    // 4) Build an array of all days in this month, with placeholders for leading blank days
    // We'll create 'startDay' blanks, then days 1..daysInMonth
    // So the first actual day appears in the correct column
    for (let i = 0; i < startDay; i++) {
      const blankCell = document.createElement("div");
      blankCell.classList.add("day-cell");
      // blankCell.innerText = ""; // no date
      calendarGrid.appendChild(blankCell);
    }
  
    // 5) For each day in the month, create a cell
    for (let day = 1; day <= daysInMonth; day++) {
      const cell = document.createElement("div");
      cell.classList.add("day-cell");
      cell.textContent = day;
  
      // Format day as YYYY-MM-DD to check if there's an entry
      const dayStr = String(day).padStart(2, "0");
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${dayStr}`;
  
      // Check if any entry has this date
      const hasEntry = entries.some(e => e.date === dateStr);
      if (hasEntry) {
        cell.classList.add("has-entry");
      }
  
      calendarGrid.appendChild(cell);
    }
  }
  
  /***********************************
    4. INIT: LOAD, STATS, RENDER
  ************************************/
  document.addEventListener("DOMContentLoaded", () => {
    const entries = loadJournalEntries();
    const { totalJournals, streak } = computeStats(entries);
  
    // Display stats
    document.getElementById("totalJournals").textContent = totalJournals;
    document.getElementById("streakCount").textContent = streak;
  
    // Render the calendar
    renderCalendar(entries);
  });