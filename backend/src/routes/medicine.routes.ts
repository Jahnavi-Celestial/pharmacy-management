import { Router } from "express";
import medicineController from '../controller/medicine.controller.ts';

export const router = Router()

router.get('/medicines', medicineController.getMedicines)
router.get('/medicines/:id', medicineController.getMedicineById)