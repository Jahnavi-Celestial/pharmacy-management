import { Router } from "express";
import customerController from "../controller/customer.controller.ts";
import { CreateCustomerInput, EditCustomerInput } from "../dto/customer.dto.ts";
import { validateDto } from "../middleware/validation.middleware.ts";
import { UserRole } from "../entities/users.ts";
import { authorizeRoles } from "../middleware/authRole.middleware.ts";

export const router = Router()

router.post('/customer', authorizeRoles(UserRole.SALESPERSON), validateDto(CreateCustomerInput), customerController.createCustomer)

router.put('/customer/:id', authorizeRoles(UserRole.SALESPERSON), validateDto(EditCustomerInput), customerController.editCustomer)

router.delete('/customer/:id', authorizeRoles(UserRole.SALESPERSON), customerController.deleteCustomer)

router.get('/customer', authorizeRoles(UserRole.SALESPERSON, UserRole.ADMIN), customerController.getCustomers)

router.get('/customer/:id', authorizeRoles(UserRole.SALESPERSON, UserRole.ADMIN), customerController.getCustomerDetail)