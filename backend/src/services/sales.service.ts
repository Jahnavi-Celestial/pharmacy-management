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

  async getSales(page: number, limit: number){
    const skip = (page - 1) * limit 
    const take = limit 
                    
    const [sale, totalCount] = await salesRepository.findAndCount(skip, take)
                    
    return {
      data: sale,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      limit,
    }
  }

  async getAllSales(id: any, page: number, limit: number){
    const skip = (page - 1) * limit 
    const take = limit 
                    
    const [sale, totalCount] = await salesRepository.findAndCountById(id, skip, take)
       
    return {
      data: sale,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      limit,
    }
  }

  async getSaleDetail(id: any){
    return salesRepository.findSaleById(id)
  }
}
 
export default new SalesService()
 