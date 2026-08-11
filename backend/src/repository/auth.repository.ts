import AppDataSource from "../config/db.ts";
import { RegisterInput } from "../dto/auth.dto.ts";
import { User } from "../entities/users.ts";

const userRepo = AppDataSource.getRepository(User);

class AuthRepository{
    async findByEmail(email: string){
        return userRepo.findOne({where: {email}});
    }

    async create(input: RegisterInput){
        return userRepo.create(input);
    }

    async save(input: RegisterInput){
        return userRepo.save(input);
    }

    async findOneById(id: any){
        return userRepo.findOne({where: {id}});
    }
}

export default new AuthRepository();
