import { Request, Response } from "express";
import medicineService from "../services/medicine.service.ts";

class MedicineController{
    async getMedicines(req: Request, res: Response){
        try{
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = String(req.query.search);

            const result = await medicineService.getMedicines({page, limit, search});

            return res.status(200).json({
                message: 'medicine fetched...',
                ...result
            });
        }
        catch(err: any){
            console.log(err.message);
        }
    }

    async getMedicineById(req: Request, res: Response){
        try{
            const { id } = req.params;

            const result = await medicineService.getMedicineById(id);

            return res.status(200).json({
                message: 'medicine details fetched...',
                data: result
            });
        }
        catch(err: any){
            if(err.message === 'medicine not exist'){
                return res.status(404).json({
                    message: err.message
                });
            }
        }
    }
}

export default new MedicineController();