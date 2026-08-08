import { apiClient } from "../../../shared/apiClient";

export interface SaleItemInput{
  medicineId: string;
  quantity: number;
}

export interface CreateSaleInput{
  customerId: string;
  salesPersonId: string;
  items: SaleItemInput[];
}

export const salesApi = {
  createSale: async (data: CreateSaleInput) => {
    const response = await apiClient.post(`/sale`, data)
    return response.data
  },

  getAdminSales: async (page = 1, limit = 10) => {
    const response = await apiClient.get(`/sale`, { params: { page, limit } })
    return response.data
  },

  getSalespersonSales: async (page = 1, limit = 10) => {
    const response = await apiClient.get(`/sale/salePerson`, { params: { page, limit } })
    return response.data
  },

  getSaleDetail: async (id: string) => {
    const response = await apiClient.get(`/sale/${id}`)
    return response.data
  },
}
