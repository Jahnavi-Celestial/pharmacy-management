import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Grid, Alert } from "@mui/material";
import { inventoryApi } from "../api/inventoryApi";

interface AddInventoryDialogProps {
  open: boolean;
  onClose: () => void;
  medicineId: string;
  onSuccess: () => void;
}

const AddInventoryDialog = ({open, onClose, medicineId, onSuccess}: AddInventoryDialogProps) => {
  const [quantity, setQuantity] = useState<number>(1)
  const [sellingPrice, setSellingPrice] = useState<number>(0)
  const [discountPercent, setDiscountPercent] = useState<number>(0)
  const [expiryDate, setExpiryDate] = useState<string>("")
  
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const todayStr = new Date().toISOString().split("T")[0]

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try{
      setSubmitting(true)
      setError(null)

      const payload = {
        medicineId,
        userId: "CURRENT_LOGGED_IN_USER_ID", 
        quantity: Number(quantity),
        sellingPrice: Number(sellingPrice),
        discountPercent: Number(discountPercent),
        expiryDate: new Date(expiryDate).toISOString(),
      }

      await inventoryApi.create(payload)
      onSuccess()
      handleClose()
    } 
    catch(err: any){
      setError(err.response?.data?.message || "Failed to add item to inventory.")
    } 
    finally{
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setQuantity(1)
    setSellingPrice(0)
    setDiscountPercent(0)
    setExpiryDate("")
    setError(null)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Add Item to Inventory</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                variant="outlined"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                required
                slotProps={{ htmlInput: { min: 1 } }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Selling Price (₹)"
                type="number"
                variant="outlined"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Math.max(0, Number(e.target.value)))}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Discount (%)"
                type="number"
                variant="outlined"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Math.min(100, Math.max(0, Number(e.target.value))))}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Expiry Date"
                type="date"
                variant="outlined"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
                slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: todayStr } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleClose} disabled={submitting} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            {submitting ? "Saving..." : "Confirm Add"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default AddInventoryDialog