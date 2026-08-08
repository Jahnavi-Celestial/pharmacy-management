import { Router } from "express";
import inventoryController from '../controller/inventory.controller.ts'
import { validateDto } from "../middleware/validation.middleware.ts";
import { AddInventoryInput, EditInventoryInput } from "../dto/inventory.dto.ts";
import { authorizeRoles } from "../middleware/authRole.middleware.ts";
import { UserRole } from "../entities/users.ts";

export const router = Router()

router.post('/inventory', authorizeRoles(UserRole.ADMIN), validateDto(AddInventoryInput), inventoryController.addInventory)

router.patch('/inventory/:id', authorizeRoles(UserRole.ADMIN), validateDto(EditInventoryInput), inventoryController.editInventory)

router.delete('/inventory/:id', authorizeRoles(UserRole.ADMIN), inventoryController.deleteFromInventory)

router.get('/inventory', authorizeRoles(UserRole.ADMIN), inventoryController.getInventory)

router.get('/inventorySaleperson', authorizeRoles(UserRole.SALESPERSON), inventoryController.getInventoryForSalePerson)

router.get('/inventory/:id', authorizeRoles(UserRole.ADMIN, UserRole.SALESPERSON), inventoryController.getInventoryDetail)