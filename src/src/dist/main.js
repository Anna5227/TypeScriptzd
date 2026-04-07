"use strict";
class Book {
    constructor(title, author) {
        this.id = Book.nextId++;
        this.title = title;
        this.author = author;
        this.createdAt = new Date();
    }
    getFullInfo() {
        return `ID: ${this.id} | "${this.title}" | ${this.author}`;
    }
    matches(title, author) {
        return this.title === title && this.author === author;
    }
}
Book.nextId = 1;
class BookStorage {
    constructor() {
        this.books = [];
    }
    addBook(book) {
        this.books.push(book);
    }
    getBooks() {
        return [...this.books];
    }
    getCount() {
        return this.books.length;
    }
    exists(title, author) {
        return this.books.some(book => book.matches(title, author));
    }
}
class BookApp {
    constructor() {
        this.titleInput = document.getElementById('bookTitle');
        this.authorInput = document.getElementById('bookAuthor');
        this.addButton = document.getElementById('addBookBtn');
        this.errorDiv = document.getElementById('errorMessage');
        this.counterSpan = document.getElementById('bookCounter');
        this.booksContainer = document.getElementById('booksContainer');
        this.storage = new BookStorage();
        this.addButton.addEventListener('click', () => this.handleAddBook());
        this.titleInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter')
                this.handleAddBook();
        });
        this.authorInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter')
                this.handleAddBook();
        });
    }
    normalizeString(str) {
        return str.trim().replace(/\s+/g, ' ');
    }
    showError(message) {
        this.errorDiv.textContent = message;
        this.errorDiv.classList.add('show');
        setTimeout(() => {
            this.errorDiv.classList.remove('show');
        }, 3000);
    }
    hideError() {
        this.errorDiv.classList.remove('show');
    }
    validateInputs(title, author) {
        if (!title || !author) {
            this.showError('❌ Пожалуйста, заполните оба поля!');
            return false;
        }
        if (title.length < 1 || author.length < 1) {
            this.showError('❌ Название и автор не могут быть пустыми!');
            return false;
        }
        return true;
    }
    renderUI() {
        const count = this.storage.getCount();
        this.counterSpan.textContent = count.toString();
        const books = this.storage.getBooks();
        if (books.length === 0) {
            this.booksContainer.innerHTML = '<div class="empty-state">✨ Здесь будут ваши книги ✨</div>';
            return;
        }
        this.booksContainer.innerHTML = books.map(book => this.createBookCard(book)).join('');
    }
    createBookCard(book) {
        return `
            <div class="book-card" data-id="${book.id}">
                <div class="book-title">📖 ${this.escapeHtml(book.title)}</div>
                <div class="book-author">✍️ ${this.escapeHtml(book.author)}</div>
                <div class="book-id">🆔 ID: ${book.id}</div>
            </div>
        `;
    }
    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    capitalizeWords(str) {
        return str.split(' ').map(word => {
            if (word.length === 0)
                return word;
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).join(' ');
    }
    handleAddBook() {
        // Получение и нормализация значений
        let title = this.normalizeString(this.titleInput.value);
        let author = this.normalizeString(this.authorInput.value);
        if (!this.validateInputs(title, author)) {
            return;
        }
        title = this.capitalizeWords(title);
        author = this.capitalizeWords(author);
        if (this.storage.exists(title, author)) {
            this.showError('⚠️ Такая книга уже есть в списке!');
            return;
        }
        const newBook = new Book(title, author);
        this.storage.addBook(newBook);
        this.titleInput.value = '';
        this.authorInput.value = '';
        this.hideError();
        this.renderUI();
        setTimeout(() => {
            const cards = document.querySelectorAll('.book-card');
            if (cards.length > 0) {
                cards[cards.length - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 100);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new BookApp();
});
