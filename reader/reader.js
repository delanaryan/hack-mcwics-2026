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



