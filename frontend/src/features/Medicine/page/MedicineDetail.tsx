import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Box, Button, Grid, Card, Chip, CircularProgress, Alert, Divider, Paper, Snackbar } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MedicationIcon from "@mui/icons-material/Medication";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import UpdateIcon from "@mui/icons-material/Update";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import type { MedicineItem } from "../components/MedicineCard";
import { medicineApi } from "../api/medicineApi";
import { useAuth } from "../../../shared/hooks/useAuth";
import AddIcon from "@mui/icons-material/Add";
import AddInventoryDialog from "../../Inventory/components/AddInventoryDialog";

const MedicineDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const {userRole} = useAuth()

  const [medicine, setMedicine] = useState<MedicineItem | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [successSnackbar, setSuccessSnackbar] = useState<boolean>(false)

  const fetchMedicineDetails = async () => {
    if(!id) return

    try{
      setLoading(true)
      setError(null)
        
      const response = await medicineApi.getById(id)
      setMedicine(response.data || null)
    } 
    catch(err: any){
      if(err.response?.status === 404){
        setError("Medicine details not found.")
      } 
      else{
        setError("Could not retrieve medicine data. Please check authorization.")
      }
    } 
    finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedicineDetails()
  }, [id])

  const handleInventorySuccess = () => {
    setSuccessSnackbar(true)
    fetchMedicineDetails()
  }

  if(loading){
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress color="primary" />
      </Box>
    )
  }

  if(error || !medicine){
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
          Back to Dashboard
        </Button>
        <Alert severity="error">{error || "No data available for this resource."}</Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 }, marginTop: 10 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate(-1)} 
        sx={{ mb: 4, textTransform: "none", fontWeight: 600 }}
      >
        Back to Inventory List
      </Button>

      <Paper elevation={0} variant="outlined" sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
        <Grid container spacing={{ xs: 3, md: 5 }}>
          
          <Grid size={{ xs: 12, md: 5 }}>
            <Card 
              variant="outlined" 
              sx={{ 
                height: { xs: 260, sm: 410 }, 
                backgroundColor: "#f9f9f9", 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center",
                overflow: "hidden",
                borderRadius: 2,
                p: 2
              }}
            >
              {medicine.imageUrl ? (
                <Box 
                  component="img" 
                  src={medicine.imageUrl} 
                  alt={medicine.medicineName}
                  sx={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                />
              ) : (
                <MedicationIcon sx={{ fontSize: 120, color: "text.disabled" }} />
              )}
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }} sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.5, mb: 1 }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: "text.primary" }}>
                {medicine.medicineName}
              </Typography>
              {medicine.prescriptionRequired && (
                <Chip 
                  icon={<ReceiptLongIcon style={{ fontSize: "14px" }} />}
                  label="Prescription Required" 
                  color="warning" 
                  sx={{ fontWeight: "bold" }}
                />
              )}
            </Box>

            <Typography variant="h6" color="text.secondary" sx={{ fontStyle: "italic", mb: 3, fontWeight: 500 }}>
              {medicine.composition ? medicine.composition : "No explicit formulation composition detailed"}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mb: 4, flexGrow: 1 }}>
              <Box>
                <Typography variant="caption" color="text.disabled" sx={{ textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.5px" }}>
                  Packaging Style
                </Typography>
                <Typography variant="body1" sx={{ color: "text.primary", mt: 0.5 }}>
                  {medicine.medicineType || "N/A"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 2, sm: 4 }, mt: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarTodayIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Registered: {new Date(medicine.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <UpdateIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Last Updated: {new Date(medicine.updatedAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box 
              sx={{ 
                p: 2, 
                backgroundColor: "action.hover", 
                borderRadius: 2, 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center" 
              }}
            >
              <Typography variant="subtitle1" sx={{ color: "text.secondary", fontWeight: 500 }}>
                Base Retail Pricing
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "primary.main" }}>
                ₹{medicine.price}
              </Typography>
            </Box>

            {userRole === "ADMIN" && (
              <Box sx={{ mt: "auto" }}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={() => setDialogOpen(true)}
                  sx={{ py: 1.5, fontWeight: 600, borderRadius: 2, textTransform: "none", mt: 2.3 }}
                >
                  Add to Inventory
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>

      {id && (
        <AddInventoryDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          medicineId={id}
          onSuccess={handleInventorySuccess}
        />
      )}

      <Snackbar
        open={successSnackbar}
        autoHideDuration={4000}
        onClose={() => setSuccessSnackbar(false)}
        message="Item successfully registered to central inventory"
      />
    </Container>
  )
}

export default MedicineDetail