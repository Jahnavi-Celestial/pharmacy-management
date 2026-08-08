import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Pagination, CircularProgress, Alert } from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { salesApi } from "../../Home/api/saleApi";
import { useAuth } from "../../../shared/hooks/useAuth";

const SaleHistory = () => {
  const navigate = useNavigate()
  const { userRole } = useAuth()

  const [sales, setSales] = useState<any[]>([])
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const limit = 10

  useEffect(() => {
    const fetchSalesHistory = async () => {
      try{
        setLoading(true)
        setError(null)

        const response = userRole === "ADMIN" ? await salesApi.getAdminSales(page, limit) : await salesApi.getSalespersonSales(page, limit)

        setSales(response?.data?.data || [])
        setTotalPages(response?.data?.totalPages || 1)
      } 
      catch(err: any){
        setError("Could not retrieve commercial sales transactions database.")
      } 
      finally{
        setLoading(false)
      }
    }

    fetchSalesHistory()
  }, [page, limit, userRole])

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 }, mt: 10 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: "primary.main" }}>
          {userRole === "ADMIN" ? "Global Sales Logs" : "My Billing History"}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {userRole === "ADMIN"
            ? "Monitor store checkout receipts, processed transactions, and business revenue metrics globally."
            : "Review your personal points-of-sale invoices, client transactions, and daily billing logs."}
        </Typography>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box>
      )}

      {error && (
        <Box sx={{ mb: 4 }}><Alert severity="error">{error}</Alert></Box>
      )}

      {!loading && !error && (
        <>
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3, overflow: "hidden", overflowX: "auto", }}>
            <Table>
              <TableHead sx={{ backgroundColor: "action.hover" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Invoice Code</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Customer Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date Processed</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Total Collected</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sales.length > 0 ? (
                  sales.map((sale) => (
                    <TableRow key={sale.id} hover>
                      <TableCell sx={{ fontFamily: "monospace", fontWeight: 500 }}>
                        {sale.invoiceNumber || `INV-${sale.id?.substring(0, 8)}`}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <PersonIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {sale.customer?.fullName || "N/A"}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <CalendarTodayIcon fontSize="small" color="action" sx={{ fontSize: "0.9rem" }} />
                          <Typography variant="body2">
                            {new Date(sale.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "success.main" }}>
                          ₹{Number(sale.totalAmount || 0).toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="text"
                          startIcon={<VisibilityIcon />}
                          onClick={() => navigate(`/sale/${sale.id}`)}
                          sx={{ textTransform: "none", fontWeight: 600 }}
                        >
                          View Receipt
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                      <ReceiptIcon sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        No transactions registered in this accounting frame.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {sales.length > 0 && totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, v) => setPage(v)}
                color="primary"
                size="medium"
                shape="rounded"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  )
}

export default SaleHistory