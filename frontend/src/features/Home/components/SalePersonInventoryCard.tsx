import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface SalePersonInventoryCardProps{
  item: any;
  onAddToBasket: (item: any) => void;
}

const SalePersonInventoryCard = ({ item, onAddToBasket }: SalePersonInventoryCardProps) => {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2, height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }} noWrap>
            {item.medicine?.medicineName || `Med ID: ${item.medicineId?.substring(0, 8)}...`}
          </Typography>
          <Typography variant="body2" color={item.availableQuantity > 0 ? "text.secondary" : "error.main"} sx={{ mb: 2, fontWeight: 500 }}>
            {item.availableQuantity > 0 ? `Stock: ${item.availableQuantity} Units` : "Out of Stock"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "auto" }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
            ₹{(item.sellingPrice > item.purchasePrice) ? item.sellingPrice : item.purchasePrice}
          </Typography>
          <Button
            size="small"
            variant="contained"
            startIcon={<AddIcon />}
            disabled={item.availableQuantity <= 0}
            onClick={() => onAddToBasket(item)}
            sx={{ textTransform: "none", borderRadius: 1.5 }}
          >
            Add
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default SalePersonInventoryCard