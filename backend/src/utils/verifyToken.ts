import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = (token: string) => {
    return jwt.verify(token, String(process.env.JWT_SECRET))
}