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
                users: true
            }
        })
    }

    async delete(id: any){
        return medicineBatchRepo.delete(id)
    }

    async findAllByUserId(userId: string){
        return medicineBatchRepo.find({
            where: {
                users: {
                    id: userId
                }
            },
            relations: {
                users: true
            }
        })
    }
}

export default new InventoryRepository()