import { Router } from "express";
import medicineController from '../controller/medicine.controller.ts';
import { authorizeRoles } from "../middleware/authRole.middleware.ts";
import { UserRole } from "../entities/users.ts";

export const router = Router()

router.get('/medicines', authorizeRoles(UserRole.ADMIN), medicineController.getMedicines)

router.get('/medicines/:id', authorizeRoles(UserRole.ADMIN), medicineController.getMedicineById)