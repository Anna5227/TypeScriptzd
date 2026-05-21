class Book {
    private static idCounter: number = 0
    static _count = 0

    public readonly id: number
    public readonly title: string
    public readonly author: string
    public readonly createdAt: number

    constructor(title: string, author: string) {
        this.id = ++Book._count
        this.title = title
        this.author = author
        this.createdAt = Date.now()
    }

}

class BookStorage {
    private books: Book[] = []

    public add(book: Book): void {
        this.books.push(book)
    }

    public list(): readonly Book[] {
        return this.books
    }
    public size(): number {
        return this.books.length
    }
}

class App {
    private titleEl: HTMLInputElement
    private authorEl: HTMLInputElement
    private addBtnEl: HTMLButtonElement
    private errorEl: HTMLElement
    private counterEl: HTMLElement
    private booksContainer: HTMLElement

    constructor(private store: BookStorage){
        this.titleEl = this.must<HTMLInputElement>("#title")
        this.authorEl= this.must<HTMLInputElement>("#author")
        this.addBtnEl = this.must<HTMLButtonElement>("#addBtn")
        this.errorEl = this.must<HTMLElement>("#error")
        this.counterEl = this.must<HTMLElement>("#counter")
        this.booksContainer = this.must<HTMLElement>("#bookList")

        this.addBtnEl.addEventListener("click", () => this.onAdd())
    }
    private onAdd(): void {
        const titleValue = this.normalize(this.titleEl.value)
        const authorValue = this.normalize(this.authorEl.value)

        if (!titleValue || !authorValue) {
            this.setError("Не хватает названия или автора")
            return
        }
        this.setError("")
        const book = new Book(titleValue, authorValue)
        this.store.add(book)

        this.render()
    }
    private setError(msg: string){
        this.errorEl.textContent = msg
    }
    private normalize(s: string): string {
        return s.trim().replace(/\s+/g, "")
    }
    private must<T extends Element>(selector: string): T {
        const el = document.querySelector(selector)
        if (!el) throw new Error(`Элемент ${selector} не найден`)
        return el as T
    }

    private render(): void {
        this.counterEl.textContent = String(Book._count)
        for (const st of this.store.list()){
            const card = document.createElement("div")
            card.className = "card"

            const name = document.createElement("div")
            name.className = "name"
            name.textContent = `${st.title} ${st.author}`

            card.append(name)
            this.booksContainer.append(card)
        }
    }
}

new App(new BookStorage())