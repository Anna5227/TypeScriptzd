"use strict";
class Book {
    constructor(title, author) {
        this.id = ++Book._count;
        this.title = title;
        this.author = author;
        this.createdAt = Date.now();
    }
}
Book.idCounter = 0;
Book._count = 0;
class BookStorage {
    constructor() {
        this.books = [];
    }
    add(book) {
        this.books.push(book);
    }
    list() {
        return this.books;
    }
    size() {
        return this.books.length;
    }
}
class App {
    constructor(store) {
        this.store = store;
        this.titleEl = this.must("#title");
        this.authorEl = this.must("#author");
        this.addBtnEl = this.must("#addBtn");
        this.errorEl = this.must("#error");
        this.counterEl = this.must("#counter");
        this.booksContainer = this.must("#bookList");
        this.addBtnEl.addEventListener("click", () => this.onAdd());
    }
    onAdd() {
        const titleValue = this.normalize(this.titleEl.value);
        const authorValue = this.normalize(this.authorEl.value);
        if (!titleValue || !authorValue) {
            this.setError("Не хватает названия или автора");
            return;
        }
        this.setError("");
        const book = new Book(titleValue, authorValue);
        this.store.add(book);
        this.render();
    }
    setError(msg) {
        this.errorEl.textContent = msg;
    }
    normalize(s) {
        return s.trim().replace(/\s+/g, "");
    }
    must(selector) {
        const el = document.querySelector(selector);
        if (!el)
            throw new Error(`Элемент ${selector} не найден`);
        return el;
    }
    render() {
        this.counterEl.textContent = String(Book._count);
        for (const st of this.store.list()) {
            const card = document.createElement("div");
            card.className = "card";
            const name = document.createElement("div");
            name.className = "name";
            name.textContent = `${st.title} ${st.author}`;
            card.append(name);
            this.booksContainer.append(card);
        }
    }
}
new App(new BookStorage());
