import { apiClient } from "../../../shared/apiClient";

export interface CustomerData{
  id?: string;
  fullName: string;
  email: string;
  phone?: string;
  address: string;
}

export interface GetCustomersParams{
  page?: number;
  limit?: number;
  search?: string;
}

export const customerApi = {
  createCustomer: async (data: CustomerData) => {
    const response = await apiClient.post(`/customer`, data)
    return response.data
  },

  editCustomer: async (id: string, data: CustomerData) => {
    const response = await apiClient.put(`/customer/${id}`, data)
    return response.data
  },

  deleteCustomer: async (id: string) => {
    const response = await apiClient.delete(`/customer/${id}`)
    return response.data
  },

  getCustomers: async (params?: GetCustomersParams) => {
    const response = await apiClient.get(`/customer`, { params })
    return response.data
  },

  getAdminCustomers: async (params?: GetCustomersParams) => {
    const response = await apiClient.get(`/customer/admin`, { params })
    return response.data;
  },

  getCustomerDetail: async (id: string) => {
    const response = await apiClient.get(`/customer/${id}`)
    return response.data
  }
}
