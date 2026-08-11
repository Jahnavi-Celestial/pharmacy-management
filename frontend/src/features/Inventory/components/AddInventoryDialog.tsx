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
  const [quantity, setQuantity] = useState<string>("")
  const [sellingPrice, setSellingPrice] = useState<string>("")
  const [discountPercent, setDiscountPercent] = useState<string>("")
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
      setError(err.response?.data?.message || "All fields are mandatory.")
    } 
    finally{
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setQuantity("")
    setSellingPrice("")
    setDiscountPercent("")
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
                type="text"
                variant="outlined"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                slotProps={{ htmlInput: { min: 1 } }}
                color={error?.includes('quantity') ? "error" : "primary"}
                error={error?.includes('quantity')}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Selling Price (₹)"
                type="text"
                variant="outlined"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                slotProps={{ htmlInput: { min: 0 } }}
                color={error?.includes('sellingPrice ') ? "error" : "primary"}
                error={error?.includes('sellingPrice')}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Discount (%)"
                type="text"
                variant="outlined"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                slotProps={{ htmlInput: { min: 0 } }}
                color={error?.includes('discount') ? "error" : "primary"}
                error={error?.includes('discount')}
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