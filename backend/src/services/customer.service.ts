import customerRepository from "../repository/customer.repository.ts";
import userRepository from "../repository/auth.repository.ts";
import { CreateCustomerInput, EditCustomerInput } from "../dto/customer.dto.ts";

class CustomerService{
    async createCustomer(input: CreateCustomerInput){
        const { fullName, email, phone, address, userId } = input

        const user = await userRepository.findOneById(userId)

        if(!user){
            throw new Error(`Salesperson not found`);
        }

        const isCustomerExist = await customerRepository.findCustomerByEmail(email)

        if(isCustomerExist){
            throw new Error(`Customer already exist`);
        }
    
        const customer = customerRepository.create({ fullName, email, phone, address, salesPerson: user })
        
        return await customerRepository.save(customer)
    }

    async editCustomer(input: EditCustomerInput){
        const { id, fullName, email, phone, address, userId } = input

        const isCustomerExist = await customerRepository.findCustomerById(id)

        if(!isCustomerExist){
            throw new Error(`Customer not found`);
        }

        const updatedData = await customerRepository.save({...isCustomerExist, fullName, email, phone, address, userId})

        return updatedData
    }

    async deleteCustomer(id: any, userId: string){
        const customer = await customerRepository.findOneByIdAndSalePerson(id, userId)

        if(!customer){
            throw new Error("Customer not found")
        }

        const result = await customerRepository.delete(id, userId)

        return result
    }

    async getCustomers(userId: string, page: number, limit: number, search: string){
        const skip = (page - 1) * limit 
        const take = limit 
                
        const [customer, totalCount] = await customerRepository.findAndCount(userId, skip, take, search)
                
        return {
            data: customer,
            total: totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
            limit,
        }
    }

    async getCustomerDetail({id, userId}: {id: any, userId: string}){
        const customer = await customerRepository.findOneByIdAndSalePerson(id, userId)

        if(!customer){
            throw new Error("Customer not found")
        }
    
        return customer
    }
}

export default new CustomerService()