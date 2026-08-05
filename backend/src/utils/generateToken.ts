import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

interface Payload{
    id: string,
    email: string,
    role: string
}

export const generateToken = (payload: Payload) => {
    return jwt.sign(
        payload, 
        String(process.env.JWT_SECRET), 
        {
            expiresIn: '24h'
        }
    )
}