// language-select.js
// Language selection screen logic

const languageSelect = document.getElementById("language-select");
const languageNext = document.getElementById("language-next");

languageNext.addEventListener("click", () => {
    const language = languageSelect.value;
    if (!language) return alert("Please select a language");

    // Store the selected language in sessionStorage so the next page can access it
    sessionStorage.setItem("selectedLanguage", language);

    // Redirect to book selection page
    window.location.href = "books.html";
});
