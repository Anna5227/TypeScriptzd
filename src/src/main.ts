class Book {
    private static nextId: number = 1;
    public readonly id: number;
    public readonly title: string;
    public readonly author: string;
    public readonly createdAt: Date;

    constructor(title: string, author: string) {
        this.id = Book.nextId++;
        this.title = title;
        this.author = author;
        this.createdAt = new Date();
    }

    getFullInfo(): string {
        return `ID: ${this.id} | "${this.title}" | ${this.author}`;
    }

    matches(title: string, author: string): boolean {
        return this.title === title && this.author === author;
    }
}

class BookStorage {
    private books: Book[] = [];

    addBook(book: Book): void {
        this.books.push(book);
    }

    getBooks(): Book[] {
        return [...this.books];
    }

    getCount(): number {
        return this.books.length;
    }

    exists(title: string, author: string): boolean {
        return this.books.some(book => book.matches(title, author));
    }
}

class BookApp {
    // DOM элементы
    private titleInput: HTMLInputElement;
    private authorInput: HTMLInputElement;
    private addButton: HTMLButtonElement;
    private errorDiv: HTMLElement;
    private counterSpan: HTMLElement;
    private booksContainer: HTMLElement;
    
    private storage: BookStorage;

    constructor() {
        this.titleInput = document.getElementById('bookTitle') as HTMLInputElement;
        this.authorInput = document.getElementById('bookAuthor') as HTMLInputElement;
        this.addButton = document.getElementById('addBookBtn') as HTMLButtonElement;
        this.errorDiv = document.getElementById('errorMessage') as HTMLElement;
        this.counterSpan = document.getElementById('bookCounter') as HTMLElement;
        this.booksContainer = document.getElementById('booksContainer') as HTMLElement;
        
        this.storage = new BookStorage();
        
        this.addButton.addEventListener('click', () => this.handleAddBook());
        
        this.titleInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleAddBook();
        });
        this.authorInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleAddBook();
        });
    }

    private normalizeString(str: string): string {
        return str.trim().replace(/\s+/g, ' ');
    }

    private showError(message: string): void {
        this.errorDiv.textContent = message;
        this.errorDiv.classList.add('show');
        
        setTimeout(() => {
            this.errorDiv.classList.remove('show');
        }, 3000);
    }

    private hideError(): void {
        this.errorDiv.classList.remove('show');
    }

    private validateInputs(title: string, author: string): boolean {
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

    private renderUI(): void {
        const count = this.storage.getCount();
        this.counterSpan.textContent = count.toString();
        
        const books = this.storage.getBooks();
        
        if (books.length === 0) {
            this.booksContainer.innerHTML = '<div class="empty-state">✨ Здесь будут ваши книги ✨</div>';
            return;
        }
        
        this.booksContainer.innerHTML = books.map(book => this.createBookCard(book)).join('');
    }

    private createBookCard(book: Book): string {
        return `
            <div class="book-card" data-id="${book.id}">
                <div class="book-title">📖 ${this.escapeHtml(book.title)}</div>
                <div class="book-author">✍️ ${this.escapeHtml(book.author)}</div>
                <div class="book-id">🆔 ID: ${book.id}</div>
            </div>
        `;
    }

    private escapeHtml(str: string): string {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    private capitalizeWords(str: string): string {
        return str.split(' ').map(word => {
            if (word.length === 0) return word;
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).join(' ');
    }

    private handleAddBook(): void {
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