import { Router } from "express";
import salesController from "../controller/sales.controller.ts";

export const router = Router()

router.post('/sale', salesController.createSale)

router.get('/sale', salesController.getSales)

router.get('/sale/salePerson', salesController.getAllSalePersonSales)

router.get('/sale/:id', salesController.getSaleDetail)