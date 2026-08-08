import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Typography, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

interface BasketTableProps{
  basket: any[]
  onUpdateQuantity: (id: string, delta: number) => void
  onRemoveItem: (id: string) => void
}

const BasketTable: React.FC<BasketTableProps> = ({ basket, onUpdateQuantity, onRemoveItem }) => {
  return (
    <TableContainer sx={{ flexGrow: 1, maxHeight: 220, overflowY: "auto", mb: 3 }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Item</TableCell>
            <TableCell align="center" sx={{ fontWeight: 600 }}>Qty</TableCell>
            <TableCell align="center" sx={{ fontWeight: 600 }}>Discount</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>Price</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {basket.map((item) => {
            const price = Number(item.sellingPrice) || 0;
            const discount = Number(item.discountPercent) || 0;
            const finalItemPrice = price * (1 - discount / 100) * item.selectedQuantity;

            return (
              <TableRow key={item.id} hover>
                <TableCell sx={{ maxWidth: 120 }}>
                  {item.medicine?.medicineName || `Med ID: ${item.medicineId?.substring(0, 5)}...`}
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <IconButton size="small" onClick={() => onUpdateQuantity(item.id, -1)}><RemoveIcon fontSize="inherit" /></IconButton>
                    <Typography variant="body2" sx={{ mx: 1.5, fontWeight: 600 }}>{item.selectedQuantity}</Typography>
                    <IconButton size="small" onClick={() => onUpdateQuantity(item.id, 1)}><AddIcon fontSize="inherit" /></IconButton>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2" sx={{ fontWeight: 500, color: discount > 0 ? "success.main" : "text.secondary" }}>
                    {discount > 0 ? `${discount}%` : "-"}
                  </Typography>
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  ₹{finalItemPrice.toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="error" onClick={() => onRemoveItem(item.id)}><DeleteIcon fontSize="inherit" /></IconButton>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default BasketTable