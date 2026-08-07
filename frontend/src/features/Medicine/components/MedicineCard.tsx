import { Box, Typography, Card, CardContent, CardActionArea, Chip } from "@mui/material";
import MedicationIcon from "@mui/icons-material/Medication";

export interface MedicineItem {
  id: string;
  medicineName: string;
  composition: string;
  medicineType: string;
  imageUrl: string;
  price: string | number;
  prescriptionRequired: boolean;
  createdAt: string;
  updatedAt: string;
  stock?: number;
}

interface MedicineCardProps {
  item: MedicineItem;
  onClick: (id: string) => void;
}

export const MedicineCard = ({ item, onClick }: MedicineCardProps) => {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 2 }}>
      <CardActionArea 
        onClick={() => onClick(item.id)}
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "stretch" }}
      >
        <Box 
          sx={{ 
            height: 140, 
            backgroundColor: "#f5f5f5", 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center",
            overflow: "hidden",
            p: 1
          }}
        >
          {item.imageUrl ? (
            <Box 
              component="img" 
              src={item.imageUrl} 
              alt={item.medicineName}
              sx={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
            />
          ) : (
            <MedicationIcon sx={{ fontSize: 60, color: "text.disabled" }} />
          )}
        </Box>
        
        <CardContent sx={{ p: 2.5, flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1, gap: 1 }}>
            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Typography 
                variant="h6" 
                component="h2" 
                noWrap
                sx={{ fontWeight: 600, fontSize: "1.05rem" }}
              >
                {item.medicineName}
              </Typography>
            </Box>
            {item.prescriptionRequired && (
              <Chip
                label="Rx Required"
                size="small"
                color="warning"
                variant="outlined"
                sx={{ fontWeight: "bold", fontSize: "0.65rem", flexShrink: 0 }}
              />
            )}
          </Box>

          <Typography variant="body2" color="text.secondary" noWrap sx={{ fontStyle: "italic", mb: 0.5 }}>
            {item.composition ? item.composition : "No composition assigned"}
          </Typography>

          <Typography variant="caption" color="text.disabled" noWrap sx={{ mb: 2 }}>
            {item.medicineType}
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: "auto", color: "text.primary" }}>
            Price: ₹{item.price}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
