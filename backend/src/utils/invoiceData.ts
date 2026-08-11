import { Sale } from "../entities/sales.ts";

export function invoice(savedSale: Sale, invoiceNumber: string, totalAmount: number, medicineNames: string[]){
    return {
        invoiceNumber: invoiceNumber,
        date: new Date(savedSale.createdAt).toLocaleDateString(),
        customerName: savedSale.customer?.fullName || "Walk-in Customer",
        phone: savedSale.customer?.phone || "N/A",
        items: savedSale.items.map((item: any, index: number) => ({
            name: medicineNames[index],
            quantity: item.quantity,
            price: item.unitPrice,
            discount: item.batch.discountPercent || 0,
            total: (item.unitPrice * item.quantity) - (item.unitPrice * item.quantity * item.batch.discountPercent / 100)
        })),
        total: totalAmount
    };
}