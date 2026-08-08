import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Typography, Box, Button, Grid, CircularProgress, Alert, Divider, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EmailIcon from "@mui/icons-material/Email";
import { salesApi } from "../../Home/api/saleApi";

const SaleDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [sale, setSale] = useState<any | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSaleTicket = async () => {
      if(!id) return
      try{
        setLoading(true)
        setError(null)
        const response = await salesApi.getSaleDetail(id)
        setSale(response?.data)
      } 
      catch(err: any){
        setError("Could not retrieve detailed parameters for this checkout invoice.")
      } 
      finally{
        setLoading(false)
      }
    }

    fetchSaleTicket()
  }, [id])

  const handlePrintReceipt = () => {
    window.print()
  }

  if(loading){
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  if(error || !sale){
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>Back</Button>
        <Alert severity="error">{error || "No transactional file match found."}</Alert>
      </Container>
    )
  }

  const itemsList = sale.items || []

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 }, mt: 10 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ textTransform: "none", fontWeight: 600 }}>
          Back to Sales Logs
        </Button>
        <Button variant="outlined" startIcon={<LocalPrintshopIcon />} onClick={handlePrintReceipt} sx={{ textTransform: "none", fontWeight: 600 }}>
          Print Invoice Ticket
        </Button>
      </Box>

      <Paper variant="outlined" sx={{ p: { xs: 3, sm: 5 }, borderRadius: 3, backgroundColor: "background.paper" }} className="printable-receipt">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 3, mb: 4 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "primary.main", display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              <ReceiptIcon /> PharmaSys Invoice
            </Typography>
            <Typography variant="subtitle2" sx={{ fontFamily: "monospace", color: "text.secondary" }}>
              Ticket No: {sale.invoiceNumber || `INV-${sale.id?.toUpperCase()}`}
            </Typography>
          </Box>
          <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
            <Typography variant="body2" sx={{ display: "flex", alignItems: "center", gap: 0.5, justifyContent: { xs: "flex-start", sm: "flex-end" }, color: "text.secondary" }}>
              <CalendarTodayIcon fontSize="inherit" /> Date: {new Date(sale.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Billed Patient Profile</Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5, display: "flex", alignItems: "center", gap: 0.5 }}>
              <PersonIcon fontSize="small" color="action" /> {sale.customer?.fullName || "N/A"}
            </Typography>
            {(sale.customer?.email || sale.customerEmail) && (
              <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                <EmailIcon fontSize="inherit" color="action" /> {sale.customer?.email || "N/A"}
              </Typography>
            )}
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ textAlign: { xs: "left", sm: "right" } }}>
            <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Issuing SalePerson Reference</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
              Staff Name: {sale.salesPerson?.name.toUpperCase() || 'N/A'}
            </Typography>
          </Grid>
        </Grid>

        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: "action.hover" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Medicine Name</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Units</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Unit Price</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Discount</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Final Net Charge</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {itemsList.length > 0 ? (
                itemsList.map((item: any, index: number) => {
                  const qty = Number(item.quantity) || 1;
                  const uPrice = Number(item?.unitPrice)
                  const discount = Number(item?.batch?.discountPercent) || 0;
                  return (
                    <TableRow key={index}>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {item.batch?.medicine?.medicineName}
                      </TableCell>
                      <TableCell align="center">{qty}</TableCell>
                      <TableCell align="right">₹{uPrice.toFixed(2)}</TableCell>
                      <TableCell align="right">{discount}%</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>₹{((qty * uPrice) - (qty * uPrice * discount / 100)).toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell sx={{ fontWeight: 500 }}>Standard Compound Bundle Check</TableCell>
                  <TableCell align="center">1</TableCell>
                  <TableCell align="right">₹{Number(sale.totalAmount).toFixed(2)}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>₹{Number(sale.totalAmount).toFixed(2)}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1.5, p: 2.5, backgroundColor: "action.hover", borderRadius: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 500 }}>
            Gross Billing Summary Invoice
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "success.main" }}>
            ₹{Number(sale.totalAmount).toFixed(2)}
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}

export default SaleDetail