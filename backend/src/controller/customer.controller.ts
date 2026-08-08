import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.ts"
import customerService from "../services/customer.service.ts"

class CustomerController{
    async createCustomer(req: AuthRequest, res: Response){
        try{
            const userId = req.user!.id
            const { fullName, email, phone, address } = req.body;

            if(!fullName || !email || !address){
                return res.status(400).json({ message: "Missing required fields" })
            }

            const result = await customerService.createCustomer(userId, { fullName, email, phone, address })

            return res.status(201).json({message: 'customer added successfully', data: result})
        }
        catch(err: any){
            if(err.message === 'Customer not found' || err.message === 'Salesperson not found'){
                return res.status(404).json({ message: err.message })
            }
            return res.status(500).json({ message: "Internal server error", error: err.message })
        }
    }

    async editCustomer(req: AuthRequest, res: Response){
        try{
            const {id} = req.params
            const userId = req.user!.id
            const { fullName, email, phone, address } = req.body;

            if(!fullName || !email || !address){
                return res.status(400).json({ message: "Missing required fields" })
            }

            const result = await customerService.editCustomer(userId, { id, fullName, email, phone, address })

            return res.status(201).json({message: 'customer updated successfully', data: result})
        }
        catch(err: any){
            if(err.message === 'Customer not found'){
                return res.status(404).json({ message: err.message })
            }
            return res.status(500).json({ message: "Internal server error", error: err.message })
        }
    }

    async deleteCustomer(req: AuthRequest, res: Response){
        try{
            const { id } = req.params
            const userId = req.user!.id
    
            const result = await customerService.deleteCustomer(id, userId)
    
            return res.status(200).json({ message: 'Delete successful' })
        } 
        catch(err: any){
            if(err.message === 'Customer not found'){
                return res.status(404).json({ message: err.message })
            }
            return res.status(500).json({ message: "Internal server error", error: err.message })
        }
    }

    async getCustomers(req: AuthRequest, res: Response){
        try {
            const page = Number(req.query.page) || 1
            const limit = Number(req.query.limit) || 10
            const search = String(req.query.search)

            const userId = req.user!.id
            const result = await customerService.getCustomers(userId, page, limit, search)
      
            return res.status(200).json(result)
        } 
        catch(err: any){
            if(err.message === 'Customer not found'){
                return res.status(404).json({ message: err.message })
            }
            return res.status(500).json({ message: "Internal server error", error: err.message })
        }
    }

    async getAdminCustomers(req: AuthRequest, res: Response){
        try{
            const page = Number(req.query.page) || 1
            const limit = Number(req.query.limit) || 10
            const search = String(req.query.search || "")

            const result = await customerService.getAdminAllCustomers(page, limit, search)
  
            return res.status(200).json(result)
        } 
        catch(err: any){
            return res.status(500).json({ message: "Internal server error", error: err.message })
        }
    }

    async getCustomerDetail(req: AuthRequest, res: Response){
        try{
            const { id } = req.params
            const userId = req.user!.id
            const userRole = req.user!.role

            const result = await customerService.getCustomerDetail({ id, userId, userRole })
      
            return res.status(200).json({message: 'Details fetched successfully', data: result})
        } 
        catch(err: any){
            if(err.message === 'Customer not found'){
                return res.status(404).json({ message: err.message })
            }
            return res.status(500).json({ message: "Internal server error", error: err.message })
        }
    }
}

export default new CustomerController()