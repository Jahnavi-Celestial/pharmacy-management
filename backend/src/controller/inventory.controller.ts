import { Response } from "express";
import inventoryService from "../services/inventory.service.ts";
import { AddInventoryInput, EditInventoryInput } from "../dto/inventory.dto.ts";
import { AuthRequest } from "../middleware/auth.middleware.ts";

class InventoryController {
    async addInventory(req: AuthRequest, res: Response) {
        try{
            const userId = req.user!.id
            const { medicineId, sellingPrice, discountPercent, quantity, expiryDate }: AddInventoryInput = req.body

            const result = await inventoryService.addInventory({medicineId, userId, sellingPrice, discountPercent, quantity, expiryDate})
            
            return res.status(201).json({
                message: 'Successfully added data to the inventory',
                data: result
            })
        } 
        catch(err: any){
            if(err.message === 'Medicine not found' || err.message === 'User not found'){
                return res.status(404).json({ message: err.message });
            }
            return res.status(500).json({ message: "Internal server error", error: err.message });
        }
    }

    async editInventory(req: AuthRequest, res: Response){
        try{
            const { id } = req.params
            const userId = req.user!.id
            const { sellingPrice, discountPercent }: EditInventoryInput = req.body

            const result = await inventoryService.editInventory({ id, userId, sellingPrice, discountPercent })

            return res.status(200).json({
                message: 'Record updated successfully',
                data: result
            })
        } 
        catch(err: any){
            if(err.message === 'Records not found in the inventory'){
                return res.status(404).json({ message: err.message })
            }
            return res.status(500).json({ message: "Internal server error", error: err.message })
        }
    }

    async deleteFromInventory(req: AuthRequest, res: Response){
        try{
            const { id } = req.params
            const userId = req.user!.id

            const result = await inventoryService.deleteFromInventory(id, userId)

            return res.status(200).json({ message: 'Delete successful' })
        } 
        catch(err: any){
            if(err.message === 'Records not found in the inventory'){
                return res.status(404).json({ message: err.message })
            }
            return res.status(500).json({ message: "Internal server error", error: err.message })
        }
    }

    async getInventory(req: AuthRequest, res: Response){
        try{
            const userId: string = req.user!.id
            const result = await inventoryService.getInventory(userId)

            return res.status(200).json({
                message: "Inventory records fetched successfully",
                data: result
            })
        } 
        catch(err: any){
            return res.status(500).json({ message: "Internal server error", error: err.message })
        }
    }

    async getInventoryDetail(req: AuthRequest, res: Response){
        try{
            const { id } = req.params
            const userId: string = req.user!.id

            const result = await inventoryService.getInventoryDetail(id, userId)

            return res.status(200).json({
                message: 'Fetched data successfully',
                data: result
            })
        } 
        catch(err: any){
            if(err.message === 'Records not found in the inventory'){
                return res.status(404).json({ message: err.message })
            }
            return res.status(500).json({ message: "Internal server error", error: err.message })
        }
    }
}

export default new InventoryController()
