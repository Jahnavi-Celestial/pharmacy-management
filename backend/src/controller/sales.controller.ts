import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.ts";
import salesService from "../services/sales.service.ts";
import { CreateSaleInput } from "../dto/saleItem.dto.ts";

class SalesController{
    async createSale(req: AuthRequest, res: Response){
        try{
            const input: CreateSaleInput = req.body;

            const result = await salesService.createSale(input);
 
            return res.status(201).json({
                message: 'Sale created successfully and invoice emailed',
                data: result,
            });
        }
        catch(err: any){
            return res.json({message: err.message});
        }
    }

    async getSales(req: AuthRequest, res: Response){
        try{
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const result = await salesService.getSales(page, limit);

            return res.status(200).json({message: 'Sales fetched successfully', data: result});
        }
        catch(err: any){
            return res.json({message: err.message});
        }
    }

    async getAllSalePersonSales(req: AuthRequest, res: Response){
        try{
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;

            const id = req.user!.id;
            const result = await salesService.getAllSales(id, page, limit);

            return res.status(200).json({message: 'Sales fetched successfully', data: result});
        }
        catch(err: any){
            return res.json({message: err.message});
        }
    }

    async getSaleDetail(req: AuthRequest, res: Response){
        try{
            const {id} = req.params;

            const result = await salesService.getSaleDetail(id);

            return res.status(200).json({message: 'Sale detail fetched successfully', data: result});
        }
        catch(err: any){
            return res.json({message: err.message});
        }
    }
}

export default new SalesController();