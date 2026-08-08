import React from "react";
import { Box, TextField, Button } from "@mui/material";

interface CustomerRegisterFormProps{
  fullName: string;
  email: string;
  phone: string;
  address: string;
  loading: boolean;
  onFullNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onAddressChange: (v: string) => void;
  onRegister: (e: React.MouseEvent) => void;
}

const CustomerRegisterForm = ({
  fullName, email, phone, address, loading,
  onFullNameChange, onEmailChange, onPhoneChange, onAddressChange, onRegister
}: CustomerRegisterFormProps) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Box sx={{ display: "flex", gap: 1.5 }}>
        <TextField fullWidth size="small" label="Full Name" value={fullName} onChange={(e) => onFullNameChange(e.target.value)} />
        <TextField fullWidth size="small" type="email" label="Email Address" value={email} onChange={(e) => onEmailChange(e.target.value)} />
      </Box>
      <Box sx={{ display: "flex", gap: 1.5 }}>
        <TextField fullWidth size="small" label="Phone Number" value={phone} onChange={(e) => onPhoneChange(e.target.value)} />
        <TextField fullWidth size="small" label="Home Address" value={address} onChange={(e) => onAddressChange(e.target.value)} />
      </Box>
      <Button
        variant="outlined"
        color="primary"
        size="small"
        disabled={loading}
        onClick={onRegister}
        sx={{ textTransform: "none", fontWeight: 600, alignSelf: "flex-end", px: 3 }}
      >
        {loading ? "Registering..." : "Register Customer"}
      </Button>
    </Box>
  )
}

export default CustomerRegisterForm