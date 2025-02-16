/*******************************************************
 * BIG FAKE DATASET
 *******************************************************/
const FAKE_DATASET = [
  {
    id: 1001,
    date: "2025-06-01",
    title: "Morning Yoga",
    content: "Did 30 minutes of yoga, felt energized.",
    mood_val: 0.8,
    attachment: null
  },
  {
    id: 1002,
    date: "2025-06-02",
    title: "Work Meeting",
    content: "Discussed new app features for next sprint.",
    mood_val: 0.5,
    attachment: null
  },
  {
    id: 1003,
    date: "2025-06-03",
    title: "Grocery Shopping",
    content: "Bought veggies, fruits, and snacks for the week.",
    mood_val: 0.7,
    attachment: null
  },
  {
    id: 1004,
    date: "2025-06-04",
    title: "Movie Night",
    content: "Watched a comedy with friends, lots of laughter!",
    mood_val: 0.9,
    attachment: null
  },
  {
    id: 1005,
    date: "2025-05-28",
    title: "Doctor Appointment",
    content: "Checkup was routine. Advised me to drink more water.",
    mood_val: 0.6,
    attachment: null
  },
  {
    id: 1006,
    date: "2025-06-10",
    title: "Code Refactoring",
    content: "Spent hours cleaning old code, quite tedious.",
    mood_val: 0.4,
    attachment: null
  },
  {
    id: 1007,
    date: "2025-06-11",
    title: "Beach Trip",
    content: "Relaxing by the shore, enjoying the sun.",
    mood_val: 0.95,
    attachment: null
  },
  {
    id: 1008,
    date: "2025-06-12",
    title: "Late-night Gaming",
    content: "Played online games until 2 AM, super fun but tired.",
    mood_val: 0.75,
    attachment: null
  },
  {
    id: 1009,
    date: "2025-06-13",
    title: "Random Thoughts",
    content: "Thinking about journaling strategies, might add tagging next.",
    mood_val: 0.65,
    attachment: null
  },
  {
    id: 1010,
    date: "2025-06-14",
    title: "Concert Night",
    content: "Live band was amazing, the atmosphere was electric!",
    mood_val: 0.85,
    attachment: null
  }
];

/*******************************************************
 * LOAD / SAVE localStorage
 *******************************************************/
function loadInitialData() {
  const existing = localStorage.getItem("journalEntries");
  if (!existing) {
    // If no data, store the FAKE_DATASET
    localStorage.setItem("journalEntries", JSON.stringify(FAKE_DATASET));
  }
}

function getAllJournals() {
  const stored = localStorage.getItem("journalEntries");
  return stored ? JSON.parse(stored) : [];
}

function renderMoodChart() {
  // Retrieve all journal entries from localStorage
  const entries = JSON.parse(localStorage.getItem("journalEntries")) || [];
  if (!entries.length) {
    console.warn("No journal entries found for chart.");
    return;
  }
  
  // Sort entries by date ascending
  entries.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Extract dates and mood values. Convert mood from 1-100 to a normalized scale (if needed) or use directly.
  const labels = entries.map(e => e.date);
  const moodValues = entries.map(e => e.mood_val !== null ? e.mood_val : 0);

  // Get the canvas context (ensure you have a canvas element with id="moodChart" in your HTML)
  const ctx = document.getElementById("moodChart").getContext("2d");

  // Create the chart
  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Mood Sentiment",
          data: moodValues,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true,
          tension: 0.2
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 100, // if mood is 1-100; if normalized (0-1), change accordingly
          title: {
            display: true,
            text: "Mood Score"
          }
        },
        x: {
          title: {
            display: true,
            text: "Date"
          }
        }
      },
      plugins: {
        legend: {
          display: true
        },
        tooltip: {
          enabled: true
        }
      }
    }
  });
}



