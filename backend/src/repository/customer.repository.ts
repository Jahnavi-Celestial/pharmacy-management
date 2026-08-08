import { ILike } from "typeorm"
import AppDataSource from "../config/db.ts"
import { Customer } from "../entities/customer.ts"

const customerRepo = AppDataSource.getRepository(Customer)

class CustomerRepository{
    async findCustomerByEmail(email: string){
        return customerRepo.findOne({where: {email}})
    }

    create(customer: any){
        return customerRepo.create({
            ...customer
        })
    }

    async save(customer: any){
        return customerRepo.save(customer)
    }

    async findCustomerById(id: any){
        return customerRepo.findOne({where: {id}})
    }

    async delete(id: any, userId: string){
        const customer = await this.findOneByIdAndSalePerson(id, userId)

        if (!customer) {
            throw new Error("Customer not found");
        }

        return customerRepo.remove(customer); 
    }

    async findAndCount(userId: string, skip: number, take: number, search: string){
        return customerRepo.findAndCount({
            where: {
                fullName: ILike(`%${search}%`),
                salesPerson: { id: userId }
            },
            skip,
            take,
            order: { createdAt: "DESC" }
        })
    }

    async findAndCountForAdmin(skip: number, take: number, search: string){
        return customerRepo.findAndCount({
            where: {
                fullName: ILike(`%${search}%`),
            },
            skip,
            take,
            order: { createdAt: "DESC" }
        })
    }
    
    async findOneByIdAndSalePerson(id: any, userId: string){
        return customerRepo.findOne({
            where: { 
                id, 
                salesPerson: { id: userId }
            },
            relations: {
                sales: true
            }
        })
    }
}

export default new CustomerRepository()