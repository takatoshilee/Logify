// --- Date Formatting Function ---
function formatDate(dateInput) {
    // Append "T00:00:00" so the date is parsed in local time
    const date = new Date(dateInput + "T00:00:00");
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dayName = days[date.getDay()];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${dayName}, ${month} ${day},${year}`;
  }
  
  // --- Render Journals Function ---
  // Accepts an optional array of entries; if none is provided, loads all from localStorage.
  function renderJournals(entriesParam) {
    const container = document.getElementById("journalsContainer");
    container.innerHTML = ""; // Clear existing entries
  
    let entries = entriesParam;
    if (!entries) {
      entries = JSON.parse(localStorage.getItem("journalEntries")) || [];
    }
  
    // Sort entries by id descending (most recent first)
    entries.sort((a, b) => b.id - a.id);
  
    entries.forEach(entry => {
      const entryDiv = document.createElement("div");
      entryDiv.classList.add("journal-entry");
  
      // Create the image element (use attachment if provided)
      const img = document.createElement("img");
      img.src = entry.attachment ? entry.attachment : "./entry/images/image.png";
      img.alt = "Reading Journal";
  
      // Create the title element
      const titleDiv = document.createElement("div");
      titleDiv.classList.add("journal-title");
      titleDiv.textContent = entry.title || "Untitled";
  
      // Create the journal-text container
      const journalTextDiv = document.createElement("div");
      journalTextDiv.classList.add("journal-text");
  
      // Create the date element inside journal-text
      const dateDiv = document.createElement("div");
      dateDiv.classList.add("journal-date");
      dateDiv.textContent = formatDate(entry.date);
  
      // Append date element into journal-text container
      journalTextDiv.appendChild(dateDiv);
  
      // Append image, title, and journal-text to the journal entry
      entryDiv.appendChild(img);
      entryDiv.appendChild(titleDiv);
      entryDiv.appendChild(journalTextDiv);
  
      // When clicking the entry, navigate to the detail view
      entryDiv.addEventListener("click", () => {
        window.location.href = `entry/entry.html?id=${entry.id}`;
      });
  
      container.appendChild(entryDiv);
    });
  }
  
  // --- Filter Journals Function ---
  // Filters entries based on a query that searches title and content.
  function filterJournals(query) {
    const allEntries = JSON.parse(localStorage.getItem("journalEntries")) || [];
    return allEntries.filter(entry => {
      const title = entry.title ? entry.title.toLowerCase() : "";
      const content = entry.content ? entry.content.toLowerCase() : "";
      return title.includes(query.toLowerCase()) || content.includes(query.toLowerCase());
    });
  }
  
  // --- Search Box Event Handling ---
  const searchBox = document.getElementById("search-box");
  searchBox.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      const query = event.target.value.trim();
      if (query === "") {
        // If query is empty, show all entries.
        renderJournals();
      } else {
        const filteredEntries = filterJournals(query);
        renderJournals(filteredEntries);
      }
      event.target.value = "";           // Clear the input
      searchBox.classList.remove("open"); // Optionally collapse the search box
    }
  });
  
  // --- Search Button Toggle (if you're using a toggle style) ---
  const searchBtn = document.getElementById("search-btn");
  searchBtn.addEventListener("click", function () {
    if (searchBox.classList.contains("open")) {
      searchBox.classList.remove("open");
    } else {
      searchBox.classList.add("open");
      searchBox.focus();
    }
  });
  
  // --- Initial Render on DOM Content Loaded ---
  document.addEventListener("DOMContentLoaded", () => {
    renderJournals();
  });


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}