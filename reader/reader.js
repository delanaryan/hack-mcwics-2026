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

const API_BASE_URL = "/api/books";
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
        "chinese": "zh",
        "italian": "it",
    };

// Check if language was pre-selected from index.html
const storedLanguage = sessionStorage.getItem("selectedLanguage");
if (storedLanguage) {
    languageSelect.value = storedLanguage;
    // Automatically trigger the language selection flow
    languageNext.click();
}

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

    try {
        // Fetch book details from backend (which will have the text)
        if (book.book_id) {
            const res = await fetch(`${API_BASE_URL}/${book.book_id}`);
            if (res.ok) {
                const bookData = await res.json();
                
                // If backend has full text, use it; otherwise fetch from text_url
                let rawText = bookData.text || bookData.full_text || "";
                
                if (!rawText && bookData.text_url) {
                    // Fetch through your backend as a proxy to avoid CORS
                    const textRes = await fetch(`/api/books/${book.book_id}/text`);
                    if (textRes.ok) {
                        rawText = await textRes.text();
                    }
                }
                
                if (rawText) {
                    // Clean up Project Gutenberg headers/footers
                    //let cleanText = rawText;
                    const startToken = "*** START OF THE PROJECT GUTENBERG EBOOK";
                    const endToken = "*** END OF THE PROJECT GUTENBERG EBOOK";
                    
                    let cleanText = cleanGutenbergText(rawText);
                    
                    console.log("Clean text preview (first 500 chars):", cleanText.substring(0, 500));
                    
                    // Split into paragraphs
                    const paras = cleanText
                        .split(/\n{2,}/)
                        .map(p => p.trim())
                        .filter(p => p && p.length > 0);
                    
                    console.log("Total paragraphs:", paras.length);
                    console.log("First paragraph:", paras[0]);
                    
                    reader.innerHTML = paras.map((p, i) => {
                    // Headings (ALL CAPS, short)
                    if (/^[A-Z\s\d]+$/.test(p) && p.length < 60) {
                        return `<h2 class="text-center font-bold text-lg mt-8 mb-4">${p}</h2>`;
                    }

                    // Chapter titles
                    if (p.startsWith("CHAPTER")) {
                        return `<h3 class="text-center font-semibold mt-6 mb-4">${p}</h3>`;
                    }

                    // Normal paragraphs
                    return `
                        <p data-paragraph-id="${i + 1}" class="leading-relaxed text-gray-900">
                            ${p.replace(/\n/g, "<br>")}
                        </p>
                    `;
                }).join("")
                } else {
                    reader.innerHTML = "<p class='text-gray-500'>Full text not available for this book.</p>";
                }
            } else {
                reader.innerHTML = "<p class='text-gray-500'>Unable to fetch book details.</p>";
            }
        } else {
            reader.innerHTML = "<p class='text-gray-500'>No book id available.</p>";
        }
    } catch (err) {
        console.error("Error loading book content:", err);
        reader.innerHTML = "<p class='text-gray-500'>Error loading book content.</p>";
    }

    bookScreen.classList.add("hidden");
    readerScreen.classList.remove("hidden");
}

function cleanGutenbergText(text) {
    const start = text.indexOf("*** START OF");
    const end = text.indexOf("*** END OF");

    // If markers exist, extract ONLY the body
    if (start !== -1 && end !== -1 && end > start) {
        return text.substring(start, end)
            .replace(/\*\*\* START OF.*?\*\*\*/s, "")
            .replace(/\*\*\* END OF.*?\*\*\*/s, "")
            .trim();
    }

    return text;
}

// Highlight detection
// Highlighting logic
let selectedText = "";

const explainBtn = document.getElementById("explanation-button");

const explanationModal = document.getElementById("explanation-modal");
const modalContent = document.getElementById("modal-content");
const closeModalBtn = document.getElementById("close-modal");

explainBtn.addEventListener("click", async () => {
    if (!selectedText) return;

    // Show loading state
    modalContent.innerHTML = "<p class='text-gray-500'>Loading explanation...</p>";
    explanationModal.classList.remove("hidden");

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        const res = await fetch("/api/ai/explain", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: selectedText }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        modalContent.innerHTML = `
            <p><strong>Selected Text:</strong></p>
            <p class="italic mb-2">${selectedText}</p>
            <p><strong>AI Explanation:</strong></p>
            <p>${data.explanation || "No explanation available."}</p>
        `;
    } catch (err) {
        console.error("Error fetching explanation:", err);
        if (err.name === "AbortError") {
            modalContent.innerHTML = "<p>Explanation took too long. The AI model may be busy. Please try again.</p>";
        } else {
            modalContent.innerHTML = "<p>Error fetching explanation. Please try again.</p>";
        }
    }
});

document.addEventListener("mouseup", () => {
    const selection = window.getSelection();

    if (!selection || selection.toString().trim() === "") {
       // explainBtn.classList.add("hidden");
        return;
    }

    selectedText = selection.toString();

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    explainBtn.style.top = `${rect.bottom + window.scrollY + 5}px`;
    explainBtn.style.left = `${rect.left + window.scrollX}px`;

    explainBtn.classList.remove("hidden");
});

closeModalBtn.addEventListener("click", () => {
    explanationModal.classList.add("hidden");
});

explanationModal.addEventListener("click", (e) => {
    if (e.target === explanationModal) {
        explanationModal.classList.add("hidden");
    }
});

/*
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