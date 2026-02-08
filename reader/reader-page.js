// reader-page.js
// Reader page logic

const bookTitle = document.getElementById("book-title");
const bookAuthor = document.getElementById("book-author");
const reader = document.getElementById("reader");

let selectedBook = JSON.parse(sessionStorage.getItem("selectedBook"));

if (!selectedBook) {
    // If no book was selected, redirect back to book selection
    window.location.href = "books.html";
}

// Display book information
bookTitle.textContent = selectedBook.title;
bookAuthor.textContent = selectedBook.author;

// Load book content (paragraphs)
async function loadBookContent() {
    try {
        // Fetch book content from the backend using the book ID or title
        const response = await fetch(`http://localhost:8000/api/books/${selectedBook.book_id}`);
        const bookData = await response.json();

        // Display paragraphs
        reader.innerHTML = "";
        if (bookData.content) {
            bookData.content.split("\n").forEach((paragraph, index) => {
                if (paragraph.trim()) {
                    const p = document.createElement("p");
                    p.setAttribute("data-paragraph-id", index);
                    p.textContent = paragraph;
                    reader.appendChild(p);
                }
            });
        }
    } catch (error) {
        console.error("Error loading book content:", error);
        reader.innerHTML = "<p>Error loading book content. Please try again.</p>";
    }
}

// Highlight detection
document.addEventListener("mouseup", () => {
    const selectedText = window.getSelection().toString().trim();

    if (selectedText.length > 0) {
        console.log("Selected text:", selectedText);
        // Add logic to show explanation button or send data to backend
    }
});

// Load book content on page load
loadBookContent();
