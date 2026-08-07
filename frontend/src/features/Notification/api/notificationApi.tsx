import { apiClient } from "../../../shared/apiClient"

export const notificationApi = {
  getNotifications: async () => {
    const response = await apiClient.get(`/notifications`)
    return response.data
  },

  markAllRead: async () => {
    const response = await apiClient.put(`/notifications/mark-all-read`)
    return response.data
  },

  markOneRead: async (id: string) => {
    const response = await apiClient.put(`/notifications/read/${id}`)
    return response.data
  }
}