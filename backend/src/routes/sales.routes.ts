import { Router } from "express";
import salesController from "../controller/sales.controller.ts";
import { validateDto } from "../middleware/validation.middleware.ts";
import { CreateSaleInput } from "../dto/saleItem.dto.ts";
import { authorizeRoles } from "../middleware/authRole.middleware.ts";
import { UserRole } from "../entities/users.ts";

export const router = Router();

router.post('/sale', authorizeRoles(UserRole.SALESPERSON), validateDto(CreateSaleInput), salesController.createSale);

router.get('/sale', authorizeRoles(UserRole.ADMIN), salesController.getSales);

router.get('/sale/salePerson', authorizeRoles(UserRole.SALESPERSON), salesController.getAllSalePersonSales);

router.get('/sale/:id', authorizeRoles(UserRole.ADMIN, UserRole.SALESPERSON), salesController.getSaleDetail);