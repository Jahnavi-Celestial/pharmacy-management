import { Box } from "@mui/material"
import { useAuth } from "../../../shared/hooks/useAuth"
import AdminDashboard from "../components/AdminDashboard"
import SalePersonDashboard from "../components/SalePersonDashboard"

const Home = () => {
  const {userRole} = useAuth()

  return (
    <Box sx={{marginTop: 10}}>
        {userRole == "ADMIN" ? <AdminDashboard /> : <SalePersonDashboard />}
    </Box>
  )
}

export default Home