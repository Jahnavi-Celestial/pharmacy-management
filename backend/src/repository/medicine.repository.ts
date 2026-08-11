import { ILike } from "typeorm";
import AppDataSource from "../config/db.ts";
import { Medicine } from "../entities/medicine.ts";

const medicineRepo = AppDataSource.getRepository(Medicine);

class MedicineRepository{
    async findAndCount(skip: number, take: number, search?: string){
        return medicineRepo.findAndCount({
            where: {
                medicineName: ILike(`%${search}%`)
            },
            skip,
            take,
        });
    }

    async findById(id: any){
        return medicineRepo.findOne({where: {id: id}});
    }
}

export default new MedicineRepository();
