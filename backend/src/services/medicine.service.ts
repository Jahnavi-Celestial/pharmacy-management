import { GetMedicineInput } from "../dto/medicine.dto.ts";
import medicineRepository from "../repository/medicine.repository.ts";

class MedicineService{
    async getMedicines(input: GetMedicineInput){
        const {page, limit, search} = input

        const skip = (page - 1) * limit 
        const take = limit 

        const [medicines, totalCount] = await medicineRepository.findAndCount(skip, take, search)

        return {
            data: medicines,
            total: totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
            limit,
        }
    }

    async getMedicineById(id: any){
        const medicine = await medicineRepository.findById(id)

        if(!medicine){
            throw new Error('Medicine not exist')
        }

        return medicine
    }
}

export default new MedicineService();