import { AddInventoryInput, EditInventoryInput } from "../dto/inventory.dto.ts";
import inventoryRepository from "../repository/inventory.repository.ts";
import medicineRepository from "../repository/medicine.repository.ts";
import userRepository from "../repository/auth.repository.ts";

class InventoryService{
    async addInventory(input: AddInventoryInput){
        const medicine = await medicineRepository.findById(input.medicineId)

        if(!medicine){
            throw new Error('Medicine not found')
        }

        const user = await userRepository.findOneById(input.userId)

        if(!user){
            throw new Error('User not found')
        }

        const today = new Date()
        today.setHours(0,0,0,0)

        const inputDate = new Date(input.expiryDate)
        inputDate.setHours(0,0,0,0)

        if(inputDate <= today){
            throw new Error('Expiry date must be greater than today')
        }

        const isExist = await inventoryRepository.findOneByMedicineAndUser({
            medicineId: medicine.id,
            userId: user.id
        })

        const existingExpiryDate = isExist?.expiryDate ? new Date(isExist.expiryDate).toISOString().split('T')[0] : null

        const inputExpiryDate = new Date(input.expiryDate).toISOString().split('T')[0]

        if(isExist && existingExpiryDate === inputExpiryDate){
            isExist.availableQuantity = isExist.availableQuantity + input.quantity
            isExist.quantity = isExist.quantity + input.quantity
            isExist.expiryDate = new Date(input.expiryDate)
            isExist.sellingPrice = input.sellingPrice
            isExist.discountPercent = input.discountPercent

            const savedBatch = await inventoryRepository.save(isExist)
            return savedBatch
        } 
        else{
            const newBatch = inventoryRepository.create({
                ...input,
                medicine,
                purchasePrice: medicine.price,
                quantity: input.quantity,
                availableQuantity: input.quantity,
                expiryDate: new Date(input.expiryDate),
                users: user
            })

            const savedBatch = await inventoryRepository.save(newBatch)
            return savedBatch
        }
    }

    async editInventory(id: any, userId: string, sellingPrice: number, discountPercent: number){
        const inventory = await inventoryRepository.findByIdAndUserId(id, userId)

        if(!inventory){
            throw new Error('Records not found in the inventory')
        }

        const updatedData = await inventoryRepository.save({
            ...inventory,
            sellingPrice,
            discountPercent
        })

        return updatedData
    }

    async deleteFromInventory(id: string | string[] | undefined, userId: string){
        const inventory = await inventoryRepository.findByIdAndUserId(id, userId)

        if(!inventory){
            throw new Error('Records not found in the inventory')
        }

        const result = await inventoryRepository.delete(id)
        return !!result.affected
    }

    async getInventory(userId: string, page: number, limit: number, search: string){
        const skip = (page - 1) * limit 
        const take = limit 
        
        const [inventory, totalCount] = await inventoryRepository.findAndCount(userId, skip, take, search)
        
        return {
            data: inventory,
            total: totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
            limit,
        }
    }

    async getInventoryDetail(id: string | string[] | undefined, userId: string){
        const inventory = await inventoryRepository.findByIdAndUserId(id, userId)

        if(!inventory){
            throw new Error('Records not found in the inventory')
        }
        return inventory
    }
}

export default new InventoryService()
