import { ILike } from "typeorm";
import AppDataSource from "../config/db.ts";
import { MedicineBatch } from "../entities/medicineBatch.ts";

const medicineBatchRepo = AppDataSource.getRepository(MedicineBatch)

class InventoryRepository{
    async findOneByMedicineAndUser({medicineId, userId}: {medicineId: string, userId: string}){
        return medicineBatchRepo.findOne({
            where: {
                medicine: {
                    id: medicineId
                },
                users: {
                    id: userId
                }
            },
            relations: {
                medicine: true,
                users: true
            }
        })
    }

    create(input: Partial<MedicineBatch>){
        return medicineBatchRepo.create(input)
    }

    async save(input: MedicineBatch){
        return medicineBatchRepo.save(input)
    }

    async findByIdAndUserId(id: any, userId: string){
        return medicineBatchRepo.findOne({
            where: {
                id,
                users: {
                    id: userId
                }
            },
            relations: {
                users: true,
                medicine: true
            }
        })
    }

    async delete(id: any){
        return medicineBatchRepo.delete(id)
    }

    async findAndCount(userId: string, skip: number, take: number, search: string){
        return medicineBatchRepo.findAndCount({
            where: {
                medicine: {
                    medicineName: ILike(`%${search}%`)
                },
                users: {
                    id: userId
                }
            },
            relations: {medicine: true, users: true},
            skip,
            take,
        })
    }
}

export default new InventoryRepository()