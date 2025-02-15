const searchBtn = document.getElementById("search-btn");
const searchBox = document.getElementById("search-box");

searchBtn.addEventListener("click", function () {
  if (searchBox.classList.contains("open")) {
    // Collapse
    searchBox.classList.remove("open");
  } else {
    // Expand
    searchBox.classList.add("open");
    searchBox.focus();
  }
});