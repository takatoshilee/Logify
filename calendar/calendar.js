document.addEventListener("DOMContentLoaded", () => {
  // Set the top bar's date display
  const dateDisplay = document.getElementById("dateDisplay");
  const now = new Date();
  const dayNames = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
  const monthNames = ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE",
                      "JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];
  
  dateDisplay.textContent = `${dayNames[now.getDay()]}, ${String(now.getDate()).padStart(2,'0')} ${monthNames[now.getMonth()]}`;
  
  // Set the month name in the dropdown
  const monthNameElement = document.getElementById("monthName");
  monthNameElement.textContent = monthNames[now.getMonth()];

  let currentYear = now.getFullYear();
  let currentMonth = now.getMonth();
  renderCalendar(currentYear, currentMonth);
  updateStats();

  // Add journal button handler
  document.getElementById("add-journal-btn").addEventListener("click", () => {
    window.location.href = "../entry/entry.html";
  });

  // Handle month dropdown toggle
  const monthToggleBtn = document.getElementById("monthToggleBtn");
  monthToggleBtn.addEventListener("click", () => {
    showMonthDropdown();
  });

  function showMonthDropdown() {
    const dropdown = document.createElement("div");
    dropdown.classList.add("month-dropdown-menu");
    
    monthNames.forEach((month, index) => {
      const monthOption = document.createElement("div");
      monthOption.textContent = month;
      monthOption.classList.add("month-option");
      monthOption.addEventListener("click", () => {
        currentMonth = index;
        monthNameElement.textContent = monthNames[currentMonth];
        renderCalendar(currentYear, currentMonth);
        dropdown.remove(); // Close dropdown after selection
      });
      dropdown.appendChild(monthOption);
    });

    // Remove existing dropdown if it exists
    const existingDropdown = document.querySelector(".month-dropdown-menu");
    if (existingDropdown) {
      existingDropdown.remove();
    }

    // Add new dropdown below the button
    monthToggleBtn.parentElement.appendChild(dropdown);
  }
});

/**
 * Groups journal entries by date and computes the average mood.
 * Returns an object where keys are dates ("YYYY-MM-DD") and values are average mood scores.
 */
function getDailyMoodAverages() {
  const entries = JSON.parse(localStorage.getItem("journalEntries")) || [];
  const dailyMood = {}; // e.g., { "2025-06-26": [30, 70], ... }

  entries.forEach(entry => {
    if (entry.mood_val !== null && entry.mood_val !== undefined && entry.date) {
      if (!dailyMood[entry.date]) {
        dailyMood[entry.date] = [];
      }
      dailyMood[entry.date].push(Number(entry.mood_val));
    }
  });

  const averages = {};
  for (let date in dailyMood) {
    const scores = dailyMood[date];
    if (scores.length > 0) {
      const avg = scores.reduce((sum, val) => sum + val, 0) / scores.length;
      averages[date] = Math.round(avg);
    }
  }
  console.log("Computed Daily Averages:", averages);
  return averages;
}

/**
 * Maps a mood score (1-100) to a color.
 * For scores 1-50: interpolates from red to yellow.
 * For scores 51-100: interpolates from yellow to blue.
 */
function getMoodColor(score) {
  // Ensure the score is between 1 and 100
  score = Math.max(1, Math.min(100, score));

  if (score <= 50) {
    const ratio = (score - 1) / 49; // 0 to 1
    const green = Math.round(255 * ratio);
    return `rgb(255, ${green}, 0)`; // red to yellow
  } else {
    const ratio = (score - 50) / 50; // 0 to 1
    const red = Math.round(255 * (1 - ratio));
    const green = Math.round(255 * (1 - ratio));
    const blue = Math.round(255 * ratio);
    return `rgb(${red}, ${green}, ${blue})`; // yellow to blue
  }
}

/**
 * Renders the calendar for the specified year and month.
 * If a given date has an average mood, it color-codes that cell.
 */
function renderCalendar(year, month) {
  const datesContainer = document.getElementById("dates");
  datesContainer.innerHTML = "";
  
  const dailyAverages = getDailyMoodAverages(); // Compute averages
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const totalDays = lastDay.getDate();
  
  const firstDayIndex = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Add blank cells for days before the first day of the month
  for (let i = 0; i < firstDayIndex; i++) {
    const blankCell = document.createElement("div");
    blankCell.classList.add("date-cell");
    blankCell.style.opacity = "0.3";
    datesContainer.appendChild(blankCell);
  }
  
  // Add date cells for each day of the month
  for (let day = 1; day <= totalDays; day++) {
    const dateCell = document.createElement("div");
    dateCell.classList.add("date-cell");
    dateCell.textContent = day;
    
    // Create a date string in "YYYY-MM-DD" format
    const monthStr = String(month + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const dateStr = `${year}-${monthStr}-${dayStr}`;
    
    // If an average mood exists for this date, set the background color
    if (dailyAverages[dateStr] !== undefined) {
      const moodScore = dailyAverages[dateStr];
      const color = getMoodColor(moodScore);
      console.log(dateStr, moodScore, color);
      dateCell.style.backgroundColor = color;
      dateCell.title = `Avg Mood: ${moodScore}`;
    }
    
    // Mark today as active
    const today = new Date();
    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      dateCell.classList.add("active");
    }
    
    datesContainer.appendChild(dateCell);
  }
}

/**
 * Updates the total journal count and streak based on entries in localStorage.
 */
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