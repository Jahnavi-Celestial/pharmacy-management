import { Router } from 'express';
import authController from '../controller/auth.controller.ts';
import { validateDto } from '../middleware/validation.middleware.ts';
import { LoginInput, RegisterInput } from '../dto/auth.dto.ts';

export const router = Router()

router.post('/register', validateDto(RegisterInput), authController.registerUser);

router.post('/login', validateDto(LoginInput), authController.loginUser);