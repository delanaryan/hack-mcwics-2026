/*
User scrolls text
Paragraphs are visually separated
User highlights text
Floating button appears: “Ask what this means”
Response appears below the paragraph
Other users’ annotations are visible
This file renders highlight detection
Goal is to capture selected text, identify the paragraph and character offsets*/

// reader.js
// Screens
const languageScreen = document.getElementById("language-screen");
const bookScreen = document.getElementById("book-screen");
const readerScreen = document.getElementById("reader-screen");

// Controls
const languageSelect = document.getElementById("language-select");
const languageNext = document.getElementById("language-next");
const bookList = document.getElementById("book-list");
const bookBack = document.getElementById("book-back");

// Reader elements
const bookTitle = document.getElementById("book-title");
const bookAuthor = document.getElementById("book-author");
const reader = document.getElementById("reader");

const API_BASE_URL = "http://localhost:8000/api/books";
// Book data (FAKE FOR NOW)
/*
const books = {
    russian: [
        { title: "War and Peace", author: "Leo Tolstoy" },
        { title: "Anna Karenina", author: "Leo Tolstoy" },
        { title: "Crime and Punishment", author: "Fyodor Dostoevsky" },
        { title: "The Brothers Karamazov", author: "Fyodor Dostoevsky" },
        { title: "Fathers and Sons", author: "Ivan Turgenev" }
    ],
    french: [
        { title: "Les Misérables", author: "Victor Hugo" },
        { title: "Madame Bovary", author: "Gustave Flaubert" },
        { title: "L'Étranger", author: "Albert Camus" },
        { title: "Candide", author: "Voltaire" },
        { title: "Le comte de Monte-Cristo", author: "Alexandre Dumas" }
    ]
};
*/

async function fetchAllBooks() {
    try {
        const res = await fetch(`${API_BASE_URL}/`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error("Error fetching books:", err);
        return [];
    }
}
const languageMap = {
        "english": "en",
        "russian": "ru",
        "french": "fr",
        "spanish": "es",
        "german": "de",
        "chinese": "zh"
    };
// Language → Book screen
languageNext.addEventListener("click", async () => {
    const language = languageSelect.value;
    if (!language) return alert("Please select a language");

    const langCode = languageMap[language] || language;
    const allBooks = await fetchAllBooks();

    const books = Array.isArray(allBooks)
        ? allBooks.filter(b => (b.language || "").toLowerCase() === langCode)
        : [];

    bookList.innerHTML = "";

    if (books.length === 0) {
        bookList.innerHTML = "<p class='text-gray-500'>No books found for this language.</p>";
    } else {
        books.forEach(book => {
            const li = document.createElement("li");
            li.className = "p-3 border rounded cursor-pointer hover:bg-gray-100";
            li.textContent = book.title || "Untitled";
            li.addEventListener("click", () => openBook(book));
            bookList.appendChild(li);
        });
    }

    languageScreen.classList.add("hidden");
    bookScreen.classList.remove("hidden");
});
// Back button
bookBack.addEventListener("click", () => {
    bookScreen.classList.add("hidden");
    languageScreen.classList.remove("hidden");
});

// Open book
async function openBook(book) {
    bookTitle.textContent = book.title || "Untitled";
    bookAuthor.textContent = book.author || book.language || "";

    reader.innerHTML = "<p class='text-gray-500'>Loading book...</p>";

    // Try backend book endpoint for full text
    if (book.book_id) {
        try {
            const res = await fetch(`${API_BASE}/${book.book_id}`);
            if (res.ok) {
                const data = await res.json();
                const raw = data.text || data.full_text || "";
                if (raw) {
                    const paras = raw.split(/\n{2,}/).map(p => p.trim()).filter(p => p);
                    reader.innerHTML = paras.map((p, i) => `<p data-paragraph-id="${i+1}">${p}</p>`).join("");
                } else if (data.text_url) {
                    reader.innerHTML = `<p class='text-gray-500'>Book text available at: ${data.text_url}</p>`;
                } else {
                    reader.innerHTML = "<p class='text-gray-500'>Full text not available for this book.</p>";
                }
            } else {
                reader.innerHTML = "<p class='text-gray-500'>Unable to fetch book details.</p>";
            }
        } catch (err) {
            console.error("Error loading book content:", err);
            reader.innerHTML = "<p class='text-gray-500'>Error loading book content.</p>";
        }
    } else {
        reader.innerHTML = "<p class='text-gray-500'>No book id available.</p>";
    }

    bookScreen.classList.add("hidden");
    readerScreen.classList.remove("hidden");
}

// Highlight detection
// Highlighting logic
let selectedText = "";

const explainBtn = document.getElementById("explanation-button");

document.addEventListener("mouseup", () => {
    const selection = window.getSelection();

    if (!selection || selection.toString().trim() === "") {
        explainBtn.classList.add("hidden");
        return;
    }

    selectedText = selection.toString();

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    explainBtn.style.top = `${rect.bottom + window.scrollY + 5}px`;
    explainBtn.style.left = `${rect.left + window.scrollX}px`;

    explainBtn.classList.remove("hidden");
});

explainBtn.addEventListener("click", () => {
    console.log("Selected text:", selectedText);
});

// reader.js

/*
// Function to fetch books from the backend
function fetchBooks() {
    fetch('http://localhost:8000/api/books/') // Adjust the URL if necessary
        .then(response => response.json())
        .then(data => {
            displayBooks(data);
        })
        .catch(error => console.error('Error fetching books:', error));
}

// Function to display books in the HTML
function displayBooks(books) {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = ''; // Clear existing content
    books.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.textContent = book.title; // Adjust based on your book object structure
        bookList.appendChild(bookItem);
    });
}

// Call fetchBooks when the page loads
document.addEventListener('DOMContentLoaded', fetchBooks);
*/