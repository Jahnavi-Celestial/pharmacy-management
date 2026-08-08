import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {Container, Typography, Box, TextField, Grid, Card, CardContent, CardActionArea, Chip, Pagination, CircularProgress, Alert, InputAdornment, FormControl, Select, MenuItem} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InventoryIcon from "@mui/icons-material/Inventory";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PercentageIcon from "@mui/icons-material/Percent";
import { inventoryApi, type InventoryItemWithPurchasePrice } from "../api/inventoryApi";
import { useAuth } from "../../../shared/hooks/useAuth";

const Inventory = () => {
  const navigate = useNavigate()
  const { userRole } = useAuth()

  const [inventory, setInventory] = useState<InventoryItemWithPurchasePrice[]>([])
  const [search, setSearch] = useState<string>("")
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if(!userRole) return

    const fetchInventory = async () => {
      try{
        setLoading(true)
        setError(null)

        const apiCall = userRole === "SALESPERSON" ? inventoryApi.getSalespersonInventory : inventoryApi.getAll

        const response = await apiCall(page, limit, search)

        setInventory(response.data.data || [])
        setTotalPages(response.totalPages || 1)
      } 
      catch(err: any){
        setError("Could not retrieve pharmacy inventory data.")
      } 
      finally{
        setLoading(false)
      }
    }

    const delayDebounceFn = setTimeout(() => {
      fetchInventory()
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [page, limit, search, userRole])

  const handleSearchChange = (e: any) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const handlePageChange = (_: any, value: number) => {
    setPage(value)
  }

  const handleLimitChange = (e: any) => {
    setLimit(Number(e.target.value))
    setPage(1)
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 }, mt: 10 }}>
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          Pharmacy Inventory Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor batch stock levels, adjustments, expiration timelines, and active margins.
        </Typography>
      </Box>

      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search inventory batches..."
          value={search}
          onChange={handleSearchChange}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            },
          }}
          sx={{ backgroundColor: "background.paper", borderRadius: 1 }}
        />
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      )}

      {error && (
        <Box sx={{ mb: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {!loading && !error && (
        <>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {inventory.length > 0 ? (
              inventory.map((item) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                  <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 2 }}>
                    <CardActionArea 
                      onClick={() => navigate(`/inventory/${item.id}`)}
                      sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "stretch" }}
                    >
                      <CardContent sx={{ p: 2.5, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2, gap: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                            <InventoryIcon color="primary" fontSize="small" />
                            <Typography variant="subtitle2" color="text.secondary" noWrap>
                              ID: {item?.medicine?.medicineName}
                            </Typography>
                          </Box>
                          <Chip
                            label={`${item.availableQuantity} / ${item.quantity} Left`}
                            size="small"
                            color={item.availableQuantity > 20 ? "success" : "error"}
                            sx={{ fontWeight: "bold", fontSize: "0.75rem" }}
                          />
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 2 }}>
                          <Typography variant="h5" component="div" sx={{ fontWeight: 700, color: "text.primary" }}>
                            ₹{(item.sellingPrice > item.purchasePrice) ? item.sellingPrice : item.purchasePrice}
                          </Typography>
                          {item.discountPercent > 0 && (
                            <Chip
                              icon={<PercentageIcon style={{ fontSize: "12px" }} />}
                              label={`${item.discountPercent}% Off`}
                              size="small"
                              color="primary"
                              sx={{ fontWeight: "bold", height: 20, "& .MuiChip-label": { px: 1 } }}
                            />
                          )}
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: "auto", pt: 1 }}>
                          <CalendarTodayIcon fontSize="small" color="action" sx={{ fontSize: "0.9rem" }} />
                          <Typography variant="caption" color="text.secondary">
                            Expires: {new Date(item.expiryDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid size={{ xs: 12 }}>
                <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                  No inventory records matches your search parameters.
                </Typography>
              </Grid>
            )}
          </Grid>

          { inventory.length > 0 && (
          <Box 
            sx={{ 
              display: "flex", 
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "center", 
              alignItems: "center", 
              gap: 3,
              mt: { xs: 4, sm: 5 } 
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, position: "relative", bottom: 20 }}>
              <Typography variant="body2" color="text.secondary">
                Rows per page:
              </Typography>
              <FormControl variant="standard" size="small">
                <Select
                  value={limit}
                  onChange={handleLimitChange}
                  sx={{ fontSize: "0.875rem", fontWeight: 500 }}
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {totalPages > 1 && (
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size={window.innerWidth < 600 ? "medium" : "large"}
                shape="rounded"
              />
            )}
          </Box>
          )}
        </>
      )}
    </Container>
  )
}

export default Inventory
