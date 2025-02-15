document.addEventListener("DOMContentLoaded", () => {
    // Set the top bar's date display
    const dateDisplay = document.getElementById("dateDisplay");
    const now = new Date();
    const dayNames = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
    const monthNames = ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE",
                        "JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];
    dateDisplay.textContent = `${dayNames[now.getDay()]}, ${String(now.getDate()).padStart(2,'0')} ${monthNames[now.getMonth()]}`;
  
    // Set the month name in the dropdown
    document.getElementById("monthName").textContent = monthNames[now.getMonth()];
    
    // Render the calendar for the current month
    renderCalendar(now.getFullYear(), now.getMonth());
    
    // Update stats from localStorage
    updateStats();
    
    // Add button handler (if needed)
    document.getElementById("add-journal-btn").addEventListener("click", () => {
      window.location.href = "../entry/entry.html";
    });
  });
  
  function renderCalendar(year, month) {
    const datesContainer = document.getElementById("dates");
    datesContainer.innerHTML = "";
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();
    
    // Adjust for week starting on Sunday: add blank cells
    const firstDayIndex = firstDay.getDay(); // 0 (Sun) to 6 (Sat)
    
    for (let i = 0; i < firstDayIndex; i++) {
      const blankCell = document.createElement("div");
      blankCell.classList.add("date-cell");
      blankCell.style.opacity = "0.3";
      datesContainer.appendChild(blankCell);
    }
    
    // Add date cells
    for (let day = 1; day <= totalDays; day++) {
      const dateCell = document.createElement("div");
      dateCell.classList.add("date-cell");
      dateCell.textContent = day;
      
      // Mark today as active
      const today = new Date();
      if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
        dateCell.classList.add("active");
      }
      
      datesContainer.appendChild(dateCell);
    }
  }
  
  // Update streak & journal stats
  function updateStats() {
    const entries = JSON.parse(localStorage.getItem("journalEntries")) || [];
    document.getElementById("totalJournals").textContent = entries.length;
    
    let streak = 0;
    if (entries.length > 0) {
      const sorted = entries.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
      streak = 1;
      let currentDate = new Date(sorted[0].date + "T00:00:00");
      for (let i = 1; i < sorted.length; i++) {
        const nextDate = new Date(sorted[i].date + "T00:00:00");
        const diffDays = (currentDate - nextDate) / (1000 * 60 * 60 * 24);
        if (diffDays === 1) {
          streak++;
          currentDate = nextDate;
        } else {
          break;
        }
      }
    }
    document.getElementById("streakCount").textContent = streak;
  }