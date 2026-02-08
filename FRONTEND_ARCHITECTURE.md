# Frontend Architecture: Separate Pages

## Overview
The application has been refactored from a single HTML page with hidden sections to **3 separate pages**, each with its own HTML file and JavaScript logic.

## File Structure

### Reader Directory
```
reader/
├── index.html              # Language selection page
├── books.html              # Book selection page
├── reader.html             # Reader/text display page
├── language-select.js      # Logic for language selection
├── book-select.js          # Logic for book selection
└── reader-page.js          # Logic for reader page
```

## Page Flow

1. **index.html** → User selects a language
   - Stores selection in `sessionStorage`
   - Redirects to `books.html`

2. **books.html** → User selects a book
   - Fetches available books from backend based on selected language
   - Stores selection in `sessionStorage`
   - Redirects to `reader.html`

3. **reader.html** → User reads the book
   - Loads book content from backend
   - Displays paragraphs for reading
   - Supports text highlighting and annotations

## Data Flow

**SessionStorage** is used to pass data between pages:
- `selectedLanguage`: The language chosen by the user
- `selectedBook`: The book object selected by the user (JSON string)

## Backend Routes

The backend now serves:
- **Static Files**: HTML, CSS, and JavaScript files from the `reader` directory
- **API Routes**:
  - `GET /api/books` - Get all books or books by language
  - `GET /api/books/{book_id}` - Get a specific book's content
  - `GET /api/annotations` - Get annotations
  - `GET /api/ai` - AI-related endpoints

## Backend Configuration

The `main.py` file has been updated to:
1. Mount the `reader` directory as static files
2. Configure CORS middleware
3. Include all API routers with the `/api` prefix

## How to Run

1. Start the backend:
   ```bash
   uvicorn backend.main:app --reload
   ```

2. Access the application:
   - Open `http://localhost:8000/` in your browser
   - You'll start on the language selection page

## Benefits

- **Cleaner Code**: Each page has its own dedicated JavaScript file
- **Better Organization**: Easier to maintain and modify individual pages
- **Improved Performance**: Only load necessary JavaScript per page
- **Better UX**: Proper page navigation instead of hiding/showing divs
