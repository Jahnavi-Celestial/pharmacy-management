import { apiClient } from '../../../shared/apiClient'

export const authApi = {
  register: async (payload: any) => {
    try{
      const response = await apiClient.post("/register", payload)

      return response.data
    } 
    catch(err: any){
      throw new Error(err.response?.data?.message || "Registration failed")
    }
  },

  login: async (payload: any) => {
    try{
      const response = await apiClient.post("/login", payload)

      return response.data
    } 
    catch(err: any){
      throw new Error(err.response?.data?.message || "Login failed")
    }
  },
}
