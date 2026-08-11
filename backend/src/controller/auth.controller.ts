import { Request, Response } from "express";
import { RegisterInput } from "../dto/auth.dto.ts";
import userService from "../services/auth.service.ts";

class AuthController{
    async registerUser(req: Request, res: Response){
        const {name, email, password, role}: RegisterInput = req.body;

        const result = await userService.register({name, email, password, role});

        res.status(201).json({
            message: result
        });
    }

    async loginUser(req: Request, res: Response){
        const {email, password}: RegisterInput = req.body;

        const result = await userService.login({email, password});

        res.status(201).json({
            token: result
        });
    }
}

export default new AuthController(); 