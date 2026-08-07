import { apiClient } from "../../../shared/apiClient";

export const medicineApi = {
  getAll: async (page = 1, limit = 10, search = "") => {
    const response = await apiClient.get(`/medicines`, {
        params: { page, limit, search },
    })
    return response.data
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/medicines/${id}`)
    return response.data
  }
}
