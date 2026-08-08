import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Alert } from "@mui/material";
import { customerApi } from "../api/customerApi";

interface DeleteCustomerDialogProps{
  open: boolean;
  onClose: () => void;
  customerId: string;
  onSuccess: () => void;
}

const DeleteCustomerDialog = ({ open, onClose, customerId, onSuccess }: DeleteCustomerDialogProps) => {
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    try{
      setSubmitting(true)
      setError(null)
      await customerApi.deleteCustomer(customerId)
      onSuccess()
      onClose()
    } 
    catch(err: any){
      setError(err.response?.data?.message || "Failed to remove customer account profile file.")
    } 
    finally{
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Delete Customer Profile?</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <DialogContentText>
          Are you sure you want to permanently erase this customer account file from the central pharmacy database? This action cannot be undone.
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

export default DeleteCustomerDialog