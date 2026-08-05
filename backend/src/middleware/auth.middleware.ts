import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { verifyToken } from "../utils/verifyToken.ts";
import { UserRole } from "../entities/users.ts";

dotenv.config();

interface AuthRequest extends Request{
    user?: {
        id: string,
        email: string,
        role: UserRole
    }
}

const authCheck = async(req: AuthRequest, res: Response, next: NextFunction) => {
    try{
    const token: string | undefined = req.headers.authorization?.split(" ")[1]

    if (!token){
      return next()
    }

    const decoded: any = verifyToken(token)

    req.user = decoded

    next()
    } 
    catch(err: any){
        return { err: err.message };
    }
}