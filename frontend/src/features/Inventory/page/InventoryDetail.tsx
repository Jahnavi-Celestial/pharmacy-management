import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Box, Button, Grid, Chip, CircularProgress, Alert, Divider, Paper, Stack } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InventoryIcon from "@mui/icons-material/Inventory";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { inventoryApi, type InventoryItemWithPurchasePrice } from "../api/inventoryApi";
import UpdateInventoryDialog from "../components/UpdateInventoryDialog";
import DeleteInventoryDialog from "../components/DeleteInventoryDialog";
import { useAuth } from "../../../shared/hooks/useAuth";

export const InventoryDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {userRole} = useAuth()

  const [item, setItem] = useState<InventoryItemWithPurchasePrice | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [editOpen, setEditOpen] = useState<boolean>(false)
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false)

  const fetchInventoryDetails = async () => {
    if (!id) return
    try{
      setLoading(true)
      setError(null)

      const response = await inventoryApi.getById(id)
      setItem(response.data || response)
    } 
    catch(err: any){
      setError("Could not retrieve this inventory batch file record detail.")
    } 
    finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInventoryDetails()
  }, [id])

  const handleDeleteSuccess = () => {
    navigate("/inventory")
  }

  if(loading){
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress color="primary" />
      </Box>
    )
  }

  if(error || !item){
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>Back</Button>
        <Alert severity="error">{error || "No database data match found."}</Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 }, mt: 10 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 4, textTransform: "none", fontWeight: 600 }}>
        Back to Inventory List
      </Button>

      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2, mb: 3 }}>
          <Box>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: "text.primary", display: "flex", alignItems: "center", gap: 1 }}>
              <InventoryIcon color="primary" /> 
              Inventory Detail
            </Typography>
          </Box>
          <Chip
            label={`${item.availableQuantity} / ${item.quantity} Units in Stock`}
            color={item.availableQuantity > 10 ? "success" : "error"}
            sx={{ fontWeight: "bold" }}
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
                Medicine Name
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>{item?.medicine?.medicineName}</Typography>
          </Grid>

          {userRole === 'ADMIN' && <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
                Base Unit Purchase Value
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5, color: "primary.main" }}>₹{item.purchasePrice}</Typography>
          </Grid>}

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
                Base Unit Selling Value
            </Typography>
            {userRole == 'ADMIN' && <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5, color: "primary.main" }}>
              ₹{item.sellingPrice}
            </Typography>}
            {userRole == 'SALESPERSON' && <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5, color: "primary.main" }}>
              ₹{(item.sellingPrice > item.purchasePrice) ? item.sellingPrice : item.purchasePrice}
            </Typography>}
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
                Assigned Margin Discount
            </Typography>
            <Typography variant="body1" sx={{ mt: 0.5 }}>{item.discountPercent}% Off </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
                Product Expiry Target Timeline
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5, display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarTodayIcon fontSize="inherit" color="action" /> {new Date(item.expiryDate).toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>

        {userRole === "ADMIN" && (
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 4 }}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => setEditOpen(true)}
              sx={{ py: 1.2, fontWeight: 600, borderRadius: 2, textTransform: "none" }}
            >
              Edit Batch Parameters
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteOpen(true)}
              sx={{ py: 1.2, fontWeight: 600, borderRadius: 2, textTransform: "none" }}
            >
              Delete Batch Record
            </Button>
          </Stack>
        )}
      </Paper>

      <UpdateInventoryDialog open={editOpen} onClose={() => setEditOpen(false)} item={item} onSuccess={fetchInventoryDetails} />
      <DeleteInventoryDialog open={deleteOpen} onClose={() => setDeleteOpen(false)} itemId={item.id} onSuccess={handleDeleteSuccess} />
    </Container>
  )
}

export default InventoryDetail