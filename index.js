document.getElementById("search-btn").addEventListener("click", function () {
    let searchBox = document.getElementById("search-box");

    if (searchBox.style.width === "150px") {
        searchBox.style.width = "0px"; // Collapse
        searchBox.style.opacity = "0";
        setTimeout(() => searchBox.classList.add("hidden"), 300); // Delay hiding to match transition
    } else {
        searchBox.classList.remove("hidden"); // Show input
        setTimeout(() => {
            searchBox.style.width = "150px"; // Expand
            searchBox.style.opacity = "1";
        }, 10); // Tiny delay to allow transition
        searchBox.focus();
    }
});