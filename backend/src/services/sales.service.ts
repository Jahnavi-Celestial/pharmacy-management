import { CreateSaleInput } from '../dto/saleItem.dto.ts';
import salesRepository from '../repository/sales.repository.ts';
import createPdf from '../utils/createPdf.ts';
import { invoice } from '../utils/invoiceData.ts';
import {sendEmailWithPdf} from '../utils/sendEmail.ts'
 
class SalesService{
  async createSale(input: CreateSaleInput){
    const { savedSale, invoiceNumber, totalAmount, medicineNames } = await salesRepository.createSaleTransaction(input)
 
    const invoiceDate = invoice(savedSale, invoiceNumber, totalAmount, medicineNames)

    const pdfBuffer: any[] = []
    await new Promise((resolve, reject) => {
      createPdf(
        (chunk: any) => pdfBuffer.push(chunk),
        () => resolve(true),
        invoiceDate
      )
    })
    const buffer = Buffer.concat(pdfBuffer)
 
    if(savedSale.customer && savedSale.customer.email){
      await sendEmailWithPdf(savedSale.customer.email, invoiceNumber, buffer)
    }
 
    return { invoiceNumber, totalAmount, sale: savedSale }
  }

  async getSales(){
    return salesRepository.findAllSales()
  }

  async getAllSales(id: any){
    return salesRepository.findAllSalesForSalePerson(id)
  }

  async getSaleDetail(id: any){
    return salesRepository.findSaleById(id)
  }
}
 
export default new SalesService()
 