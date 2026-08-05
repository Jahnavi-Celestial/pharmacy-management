import { LoginInput, RegisterInput } from "../dto/auth.dto.ts";
import authRepository from "../repository/auth.repository.ts";
import { comparePassword } from "../utils/comparePassword.ts";
import { generateToken } from "../utils/generateToken.ts";
import { hashPassword } from "../utils/passwordHash.ts";

class AuthService{
    async register(input: RegisterInput){
        const {name, email, password, role} = input;

        const isExist = await authRepository.findByEmail(email);

        if(isExist){
            throw new Error("User already exists with this email.")
        }

        const hasedPassword = await hashPassword(password)

        const user = await authRepository.create({
            ...input,
            password: hasedPassword,
        })

        await authRepository.save(user)

        return user;
    }

    async login(input: LoginInput){
        const {email, password} = input;

        const isExist = await authRepository.findByEmail(email)

        if(!isExist){
            throw new Error("Invalid Credentials.")
        }

        const isPassword = await comparePassword(password, isExist.password)

        if(!isPassword){
            throw new Error("Invalid Credentials.")
        }

        const token = generateToken(
            {
                id: isExist.id,
                email: isExist.email,
                role: isExist.role,
            }
        )

        return token;
    }
}

export default new AuthService();