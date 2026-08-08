import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Box, Button, Grid, Chip, CircularProgress, Alert, Divider, Paper, Stack } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import { useAuth } from "../../../shared/hooks/useAuth";
import { customerApi } from "../api/customerApi";
import EditCustomerDialog from "../components/EditCustomerDialog";
import DeleteCustomerDialog from "../components/DeleteCustomerDialog";

const CustomerDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { userRole } = useAuth()

  const [customer, setCustomer] = useState<any | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [editOpen, setEditOpen] = useState<boolean>(false)
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false)

  const fetchCustomerDetails = async () => {
    if(!id) return
    try{
      setLoading(true)
      setError(null)
      const response = await customerApi.getCustomerDetail(id)
      setCustomer(response?.data || response)
    } 
    catch(err: any){
      setError("Could not retrieve this customer account record file.")
    } 
    finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomerDetails()
  }, [id])

  const handleDeleteSuccess = () => {
    navigate("/customer")
  }

  if(loading){
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  if(error || !customer){
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>Back</Button>
        <Alert severity="error">{error || "No customer matching identifier found."}</Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 }, mt: 10 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 4, textTransform: "none", fontWeight: 600 }}>
        Back to Customer Records
      </Button>

      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2, mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <PersonIcon color="primary" sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: "text.primary" }}>
                {customer.fullName}
              </Typography>
              <Typography variant="caption" color="text.secondary">ID: {customer.id}</Typography>
            </Box>
          </Box>
          <Chip label="Verified Account" color="success" size="small" sx={{ fontWeight: "bold" }} />
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 700, textTransform: "uppercase" }}>Email Address</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5, display: "flex", alignItems: "center", gap: 1 }}>
              <EmailIcon fontSize="small" color="action" /> {customer.email}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 700, textTransform: "uppercase" }}>Phone Number</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5, display: "flex", alignItems: "center", gap: 1 }}>
              <PhoneIcon fontSize="small" color="action" /> {customer.phone || "No phone added"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 700, textTransform: "uppercase" }}>Registered Home Address</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5, display: "flex", alignItems: "center", gap: 1 }}>
              <HomeIcon fontSize="small" color="action" /> {customer.address}
            </Typography>
          </Grid>
        </Grid>

        {userRole === "SALESPERSON" && (
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 4 }}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => setEditOpen(true)}
              sx={{ py: 1.2, fontWeight: 600, borderRadius: 2, textTransform: "none" }}
            >
              Edit Customer Profile
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteOpen(true)}
              sx={{ py: 1.2, fontWeight: 600, borderRadius: 2, textTransform: "none" }}
            >
              Delete Profile
            </Button>
          </Stack>
        )}
      </Paper>

      <EditCustomerDialog open={editOpen} onClose={() => setEditOpen(false)} customer={customer} onSuccess={fetchCustomerDetails} />
      <DeleteCustomerDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} customerId={id!} onSuccess={handleDeleteSuccess} />
    </Container>
  )
}

export default CustomerDetail