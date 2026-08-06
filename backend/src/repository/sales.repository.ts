import AppDataSource from '../config/db.ts';
import { Sale } from '../entities/sales.ts';
import { MedicineBatch } from '../entities/medicineBatch.ts';
import { Customer } from '../entities/customer.ts';
import { SaleItem } from '../entities/saleItem.ts';
import { CreateSaleInput } from '../dto/saleItem.dto.ts';
import { User } from '../entities/users.ts';
 
class SalesRepository {
  async createSaleTransaction(saleData: CreateSaleInput){
    return await AppDataSource.transaction(async (manager) => {
      let totalAmount = 0
      const saleItemsToCreate: SaleItem[] = []

      const medicineNames: string[] = []
 
      for(const item of saleData.items){
        const batch = await manager.findOne(MedicineBatch, {
          where: { 
            id: item.medicineId
          },
          relations:{
            medicine: true
          },
          order: { expiryDate: 'ASC' },
        })
 
        if(!batch || batch.availableQuantity < item.quantity){
          throw new Error(`Not enough stock available for medicine ${batch?.medicine.medicineName}`)
        }
 
        batch.availableQuantity = batch.availableQuantity - item.quantity
        await manager.save(batch)
 
        const unitPrice = batch.sellingPrice > batch.purchasePrice ? batch.sellingPrice : batch.purchasePrice
        totalAmount = totalAmount + ((unitPrice * item.quantity) - (unitPrice * item.quantity * batch.discountPercent / 100))
 
        const saleItem = new SaleItem()
        saleItem.quantity = item.quantity
        saleItem.unitPrice = unitPrice
        saleItem.batch = batch
        
        saleItemsToCreate.push(saleItem)
        medicineNames.push(batch.medicine.medicineName)
      }
 
      const invoiceNumber = `INV-${Date.now()}`
 
      const sale = new Sale()
      sale.invoiceNumber = invoiceNumber
      sale.totalAmount = totalAmount
      sale.items = saleItemsToCreate
      
      if(saleData.customerId){
        const customer = await manager.findOneBy(Customer, { 
          id: saleData.customerId,
          salesPerson: {
            id: saleData.salesPersonId
          } 
        })
        if(customer){
            sale.customer = customer
        }
        else{
          throw new Error('Customer not found')
        }
      }

      if(saleData.customerId){
        const salePerson = await manager.findOneBy(User, { id: saleData.salesPersonId })
        if(salePerson){
            sale.salesPerson = salePerson
        }
      }
 
      const savedSale = await manager.save(Sale, sale)
 
      return { savedSale, invoiceNumber, totalAmount, medicineNames }
    })
  }

  async findAllSales(){
    return AppDataSource.getRepository(Sale).find()
  }

  async findAllSalesForSalePerson(id: any){
    return AppDataSource.getRepository(Sale).find({
      where: {
        salesPerson: {
          id: id
        }
      }
    })
  }

  async findSaleById(id: any){
    return AppDataSource.getRepository(Sale).findOne({where: {id: id}})
  }
}
 
export default new SalesRepository();
 