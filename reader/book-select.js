// book-select.js
// Book selection screen logic

const bookList = document.getElementById("book-list");
const bookBack = document.getElementById("book-back");

let selectedLanguage = sessionStorage.getItem("selectedLanguage");

if (!selectedLanguage) {
    // If no language was selected, redirect back to language selection
    window.location.href = "index.html";
}

async function loadBooks() {
    try {
        const response = await fetch("http://localhost:8000/api/books"); // Update with backend URL
        const books = await response.json(); // Expected format: [{ title: "...", author: "...", language: "...", ... }, ...]
        return books;
    } catch (error) {
        console.error("Error loading books:", error);
        return [];
    }
}

async function displayBooks() {
    const allBooks = await loadBooks();

    // Filter books by selected language
    const filteredBooks = allBooks.filter(book => book.language === selectedLanguage);

    bookList.innerHTML = "";

    filteredBooks.forEach((book) => {
        const li = document.createElement("li");
        li.className = "p-3 border rounded cursor-pointer hover:bg-gray-100";
        li.textContent = `${book.title} — ${book.author}`;

        li.addEventListener("click", () => {
            // Store the selected book in sessionStorage
            sessionStorage.setItem("selectedBook", JSON.stringify(book));

            // Redirect to reader page
            window.location.href = "reader.html";
        });

        bookList.appendChild(li);
    });
}

// Back button
bookBack.addEventListener("click", () => {
    sessionStorage.removeItem("selectedLanguage");
    window.location.href = "index.html";
});

// Load and display books on page load
displayBooks();
