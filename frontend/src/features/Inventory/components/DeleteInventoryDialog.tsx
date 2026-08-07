import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Alert } from "@mui/material";
import { inventoryApi } from "../api/inventoryApi";

interface DeleteInventoryDialogProps{
  open: boolean;
  onClose: () => void;
  itemId: string;
  onSuccess: () => void;
}

export const DeleteInventoryDialog = ({ open, onClose, itemId, onSuccess }: DeleteInventoryDialogProps) => {
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    try{
      setSubmitting(true)
      setError(null)
      await inventoryApi.delete(itemId)
      onSuccess()
      onClose()
    } 
    catch(err: any){
      setError(err.response?.data?.message || "Failed to delete inventory record.")
    } 
    finally{
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Delete Inventory Item?</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <DialogContentText>
          Are you sure you want to permanently remove this batch record from the central database? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} disabled={submitting} sx={{ textTransform: "none" }}>Cancel</Button>
        <Button onClick={handleDelete} variant="contained" color="error" disabled={submitting} sx={{ textTransform: "none", fontWeight: 600 }}>
          {submitting ? "Deleting..." : "Delete Permanently"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteInventoryDialog