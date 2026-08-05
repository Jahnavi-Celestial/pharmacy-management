import { Router } from "express";
import customerController from "../controller/customer.controller.ts";

export const router = Router()

router.post('/customer', customerController.createCustomer)

router.put('/customer/:id', customerController.editCustomer)

router.delete('/customer/:id', customerController.deleteCustomer)

router.get('/customer', customerController.getCustomers)

router.get('/customer/:id', customerController.getCustomerDetail)