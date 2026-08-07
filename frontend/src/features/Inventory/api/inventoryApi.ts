import { apiClient } from "../../../shared/apiClient";
import type { MedicineItem } from "../../Medicine/components/MedicineCard";

export interface InventoryItem {
  id: string;
  medicineId: string;
  quantity: number;
  availableQuantity: number;
  expiryDate: string;
  purchasePrice?: number;
  sellingPrice: number;
  discountPercent: number;
  medicine?: MedicineItem;
}

export const inventoryApi = {
  getAll: async (page = 1, limit = 10, search = "") => {
    const response = await apiClient.get(`/inventory`, {
      params: { page, limit, search },
    })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/inventory/${id}`)
    return response.data
  },

  create: async (data: Omit<InventoryItem, "id" | "availableQuantity">) => {
    const response = await apiClient.post(`/inventory`, data)
    return response.data
  },

  update: async (id: string, data: Partial<InventoryItem>) => {
    const response = await apiClient.patch(`/inventory/${String(id)}`, data)
    return response.data
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/inventory/${id}`)
    return response.data
  },
}
