import { Router } from "express";
import inventoryController from '../controller/inventory.controller.ts'

export const router = Router()

router.post('/inventory', inventoryController.addInventory)

router.patch('/inventory/:id', inventoryController.editInventory)

router.delete('/inventory/:id', inventoryController.deleteFromInventory)

router.get('/inventory', inventoryController.getInventory)

router.get('/inventory/:id', inventoryController.getInventoryDetail)