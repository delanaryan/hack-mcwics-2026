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

async function loadBooks() {
    try {
        const response = await fetch ("http://localhost:8000/api/books"); // Update with backend URL
        const books = await response.json(); // Expected format: { russian: [...], french: [...], ... }
        return books;
    } catch (error) {
        console.error("Error loading books:", error);
        return {};
    }
}

// Language → Book screen
languageNext.addEventListener("click", () => {
    const language = languageSelect.value;
    if (!language) return alert("Please select a language");

    bookList.innerHTML = "";

    books[language].forEach((book, index) => {
        const li = document.createElement("li");
        li.className = "p-3 border rounded cursor-pointer hover:bg-gray-100";
        li.textContent = `${book.title} — ${book.author}`;

        li.addEventListener("click", () => openBook(book));

        bookList.appendChild(li);
    });

    languageScreen.classList.add("hidden");
    bookScreen.classList.remove("hidden");
});

// Back button
bookBack.addEventListener("click", () => {
    bookScreen.classList.add("hidden");
    languageScreen.classList.remove("hidden");
});

// Open book
function openBook(book) {
    bookTitle.textContent = book.title;
    bookAuthor.textContent = book.author;

    reader.innerHTML = `
    <p data-paragraph-id="1">This is the first paragraph of the book.</p>
    <p data-paragraph-id="2">This is the second paragraph.</p>
  `;

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