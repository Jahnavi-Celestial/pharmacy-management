import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Box, Alert } from "@mui/material";
import { inventoryApi, type InventoryItem } from "../api/inventoryApi";

interface UpdateInventoryDialogProps {
  open: boolean;
  onClose: () => void;
  item: InventoryItem;
  onSuccess: () => void;
}

const UpdateInventoryDialog = ({ open, onClose, item, onSuccess }: UpdateInventoryDialogProps) => {
  const [sellingPrice, setSellingPrice] = useState<string>(String(item.sellingPrice) || "")
  const [discountPercent, setDiscountPercent] = useState<string>(String(item.discountPercent) || "")

  const [submitting, setSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if(item){
      setSellingPrice(String(item.sellingPrice) || "")
      setDiscountPercent(String(item.discountPercent) || "")
    }
  }, [item])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try{
      setSubmitting(true)
      setError(null)

      const payload = {
        sellingPrice: Number(sellingPrice),
        discountPercent: Number(discountPercent),
      }

      await inventoryApi.update(item.id, payload)
      onSuccess()
      onClose()
    } 
    catch(err: any){
      setError(err.response?.data?.message || "Failed to update inventory record.")
    } 
    finally{
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Update Pricing Matrix</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Selling Price (₹)"
                type="text"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                slotProps={{ htmlInput: { min: 1 } }}
                color={error?.includes('sellingPrice') ? "error" : "primary"}
                error={error?.includes('sellingPrice')}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Discount (%)"
                type="text"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                slotProps={{ htmlInput: { min: 1 } }}
                color={error?.includes('discountPercent') ? "error" : "primary"}
                error={error?.includes('discountPercent')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={onClose} disabled={submitting} sx={{ textTransform: "none" }}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={submitting} sx={{ textTransform: "none", fontWeight: 600 }}>
            {submitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default UpdateInventoryDialog