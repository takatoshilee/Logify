// --- Helper Function ---
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// --- Search Functionality ---
const searchBtn = document.getElementById("search-btn");
const searchBox = document.getElementById("search-box");

// Remove duplicate event listeners: use one version of the toggle
searchBtn.addEventListener("click", function () {
if (searchBox.classList.contains("open")) {
    searchBox.classList.remove("open");
} else {
    searchBox.classList.add("open");
    searchBox.focus();
}
});

searchBox.addEventListener("keypress", function (event) {
if (event.key === "Enter") {
    console.log("Search Query:", event.target.value);
    event.target.value = "";
    searchBox.classList.remove("open");
}
});

// --- Render Journal Entries ---
function renderJournals() {
const container = document.getElementById("journalsContainer");
container.innerHTML = ""; // Clear existing entries

const entries = JSON.parse(localStorage.getItem("journalEntries")) || [];
// Sort entries by id descending (assuming higher id is more recent)
entries.sort((a, b) => b.id - a.id);

entries.forEach(entry => {
    const entryDiv = document.createElement("div");
    entryDiv.classList.add("journal-entry");

    // Create the image element
    const img = document.createElement("img");
    img.src = "./entry/images/image.png"; 
    img.alt = "Reading Journal";

    // Create the title element
    const titleDiv = document.createElement("div");
    titleDiv.classList.add("journal-title");
    titleDiv.textContent = entry.title || "Untitled";

    // Create the journal text container
    const journalTextDiv = document.createElement("div");
    journalTextDiv.classList.add("journal-text");

    // Create the date element inside journal-text
    const dateDiv = document.createElement("div");
    dateDiv.classList.add("journal-date");
    dateDiv.textContent = entry.date;

    // Append the date element into journal-text container
    journalTextDiv.appendChild(dateDiv);

    // Append image, title, and journal-text (with date) into the journal entry
    entryDiv.appendChild(img);
    entryDiv.appendChild(titleDiv);
    entryDiv.appendChild(journalTextDiv);

    // Set up click event so clicking the entry navigates to the detail page.
    entryDiv.addEventListener("click", () => {
    window.location.href = `entry/entry.html?id=${entry.id}`;
    });

    container.appendChild(entryDiv);
});
}

document.addEventListener("DOMContentLoaded", () => {
renderJournals();
});