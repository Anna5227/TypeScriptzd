//types
type Currency = "RUB"
type Money = {amount: number; currency: Currency}
type invoiceStatus = "draft" | "issued" | "paid"
type PaymentResult =
    | {ok: true; paidAt: string}
    | {ok: false; reason: "declined" | "network_error"}

interface Billable{
    title: string
    total(): Money
}
interface PaymentMethood{
    pay(invoice: any, amount: Money): PaymentResult
}

abstract class InvoiceLine implements Billable{
    public readonly title: string

    protected constructor(title: string, protected readonly qty: number){
        this.title = title
    }

    protected abstract unitPrice(): Money

    public total(): Money{
        const price = this.unitPrice()
        return{amount: price.amount * this.qty, currency: price.currency}
    }
}

class LaborLine extends InvoiceLine{
    constructor(title: string, qtyHours: number, private readonly rubPerHour: number){ 
        super(title, qtyHours)
    }
    protected unitPrice(): Money{
        return{amount: this.rubPerHour, currency: "RUB"}
    }
}

// Новый класс для запчастей с наценкой
class PartLine extends InvoiceLine{
    constructor(
        title: string, 
        qty: number, 
        private readonly rubPerUnit: number,
        private readonly markupPercent: number = 20
    ){ 
        super(title, qty)
    }
    
    protected unitPrice(): Money{
        return{amount: this.rubPerUnit, currency: "RUB"}
    }

    public total(): Money{
        const basePrice = this.unitPrice()
        const baseTotal = basePrice.amount * this.qty
        const markupAmount = baseTotal * (this.markupPercent / 100)
        const totalWithMarkup = baseTotal + markupAmount
        
        return {
            amount: totalWithMarkup, 
            currency: basePrice.currency
        }
    }
}

class Invoice{
    private status: invoiceStatus = "draft"

    constructor(public readonly id: string, private readonly lines: Billable[]){}

    public issue(): void{
        if (this.status !== "draft"){
            throw new Error("Can issue only from draft")
        }
        this.status = "issued"
    }
    public markPaid(): void{
        if (this.status !== "issued"){
            throw new Error("Can pay only issued Invoice")
        }
        this.status = "paid"
    }
    public getLines(): readonly Billable[]{
        return this.lines
    }
    public getStatus(): invoiceStatus{
        return this.status
    }
}

class InvoiceCalculator{
    public sum(lines: readonly Billable[]): Money{
        return lines.reduce(
            (acc, line) => ({amount: acc.amount + line.total().amount, currency: "RUB"}),
            {amount: 0, currency: "RUB"}
        )
    }
}

class CashPayment implements PaymentMethood{
    public pay(invoice: Invoice, amount: Money): PaymentResult{
        if (invoice.getStatus() !== "issued"){
            return {ok: false, reason: "declined"}
        }
        invoice.markPaid() 
        return {ok: true, paidAt: new Date().toISOString()}
    }
}

function createInvoice(): Invoice{
    const lines = [
        new LaborLine("Диагностика", 2, 150),
        new PartLine("Тормозные колодки", 2, 2500, 25), 
        new LaborLine("Монтаж", 15, 4000),
        new PartLine("Масло моторное", 5, 800, 15), 
        new LaborLine("Выравнивание", 4, 2000),
        new PartLine("Фильтр масляный", 1, 500, 30), 
        new LaborLine("Уборка", 1, 1000),
    ]
    const invoice = new Invoice("INV-2026-0001", lines)
    return invoice
}

function demoPay(invoice: Invoice){
    invoice.issue()
    const calculator = new InvoiceCalculator()

    const total: Money = calculator.sum(invoice.getLines())

    const payment = new CashPayment()
    const result = payment.pay(invoice, total)

    console.log(1, invoice)
    console.log(2, total)
    console.log(3, result)
}

const invoice = createInvoice()
demoPay(invoice)
