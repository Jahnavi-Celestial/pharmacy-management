import { Router } from 'express';
import authController from '../controller/auth.controller.ts';

export const router = Router()

router.post('/register', authController.registerUser);

router.post('/login', authController.loginUser);