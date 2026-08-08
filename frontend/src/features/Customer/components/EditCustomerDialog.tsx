import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Box, Alert } from "@mui/material";
import { customerApi, type CustomerData } from "../api/customerApi";

interface EditCustomerDialogProps{
  open: boolean;
  onClose: () => void;
  customer: any;
  onSuccess: () => void;
}

const EditCustomerDialog = ({ open, onClose, customer, onSuccess }: EditCustomerDialogProps) => {
  const [fullName, setFullName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const [address, setAddress] = useState<string>("")

  const [submitting, setSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if(customer){
      setFullName(customer.fullName || "")
      setEmail(customer.email || "")
      setPhone(customer.phone || "")
      setAddress(customer.address || "")
    }
  }, [customer])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try{
      setSubmitting(true)
      setError(null)

      const payload: CustomerData = {
        id: String(customer.id),
        fullName: fullName.trim(),
        email: email.trim(),
        address: address.trim() || "N/A",
        phone: phone.trim() ? phone.trim() : undefined,
      }

      await customerApi.editCustomer(customer.id, payload)
      onSuccess()
      onClose()
    } 
    catch(err: any){
      setError(err.response?.data?.message || "Failed to update customer account data.")
    } 
    finally{
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Edit Customer Profile</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth type="email" label="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Home Address" value={address} onChange={(e) => setAddress(e.target.value)} />
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

export default EditCustomerDialog