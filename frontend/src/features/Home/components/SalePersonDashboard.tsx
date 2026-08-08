import React, { useState, useEffect } from "react";
import { Container, Typography, Box, TextField, Grid, Pagination, CircularProgress, Alert, InputAdornment, Paper, Divider } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import { salesApi } from "../api/saleApi";
import SalePersonInventoryCard from "./SalePersonInventoryCard";
import BillingBasket from "../components/BillingBasket";
import { inventoryApi } from "../../Inventory/api/inventoryApi";
import { useAuth } from "../../../shared/hooks/useAuth";

const SalePersonDashboard = () => {
  const { userId } = useAuth()
  
  const [inventory, setInventory] = useState<any[]>([])
  const [search, setSearch] = useState<string>("")
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [inventoryLoading, setInventoryLoading] = useState<boolean>(true)
  const [inventoryError, setInventoryError] = useState<string | null>(null)

  const [basket, setBasket] = useState<any[]>([])
  const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [checkoutSuccess, setCheckoutSuccess] = useState<string | null>(null)

  const fetchSalespersonInventory = async () => {
    try {
      setInventoryLoading(true)
      setInventoryError(null)
    
      const response = await inventoryApi.getSalespersonInventory(page, 6, search)
    
      const innerPayload = response?.data
      const extractedData = innerPayload?.data || response || []
      setInventory(extractedData)

      const serverTotalPages = innerPayload?.totalPages || response?.totalPages || 1
      setTotalPages(Number(serverTotalPages))
    } 
    catch(err: any){
      setInventoryError("Failed to fetch pharmacy salesperson stock items.")
    }
    finally{
      setInventoryLoading(false)
    }
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSalespersonInventory()
    }, 300)
    return () => clearTimeout(delayDebounceFn)
  }, [page, search])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const handleAddToBasket = (item: any) => {
    setCheckoutSuccess(null)
    if (item.availableQuantity <= 0) return

    setBasket((prev) => {
      const existing = prev.find((b) => b.id === item.id)
      if(existing){
        if(existing.selectedQuantity >= item.availableQuantity) return prev
        return prev.map((b) => b.id === item.id ? { ...b, selectedQuantity: b.selectedQuantity + 1 } : b)
      }
      return [...prev, { ...item, selectedQuantity: 1, medicineId: item.id }]
    })
  }

  const handleUpdateQuantity = (id: string, delta: number) => {
    setBasket((prev) =>
      prev
        .map((b) => {
          if (b.id !== id) return b;
          const nextQty = b.selectedQuantity + delta;
          if (nextQty > b.availableQuantity) return b;
          return { ...b, selectedQuantity: nextQty };
        })
        .filter((b) => b.selectedQuantity > 0)
    )
  }

  const handleRemoveItem = (id: string) => {
    setBasket((prev) => prev.filter((b) => b.id !== id))
  }

  const handleCheckoutSubmit = async (customerInfo: { id: string; name: string; email: string }) => {
    if (basket.length === 0) return

    try{
      setCheckoutLoading(true)
      setCheckoutError(null)
      setCheckoutSuccess(null)

      const itemsPayload = basket.map(item => ({
        medicineId: String(item.medicineId),
        quantity: Number(item.selectedQuantity)
      }))

      const finalBulkPayload = {
        customerId: String(customerInfo.id),
        salesPersonId: String(userId),
        items: itemsPayload
      }

      await salesApi.createSale(finalBulkPayload)

      setCheckoutSuccess("Sale transaction completed and invoice generated successfully!")
      setBasket([])
      fetchSalespersonInventory()
    } 
    catch(err: any){
      setCheckoutError(err.response?.data?.message || "Failed to process checkout transaction.")
    } 
    finally{
      setCheckoutLoading(false)
    }
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: "primary.main" }}>
          Manage Customer And Bills
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Select items from store stock, tie or build a customer account file, and process checkout invoices.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, minHeight: "260px", display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <InventoryIcon color="primary" /> Available Store Inventory
            </Typography>

            <TextField
              fullWidth
              size="small"
              placeholder="Search store stock items..."
              value={search}
              onChange={handleSearchChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ mb: 3 }}
            />

            {inventoryLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8, flexGrow: 1 }}><CircularProgress /></Box>
            ) : inventoryError ? (
              <Alert severity="error" sx={{ mb: 2 }}>{inventoryError}</Alert>
            ) : (
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                  {inventory.map((item) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={item.id}>
                      <SalePersonInventoryCard item={item} onAddToBasket={handleAddToBasket} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {inventory.length > 0 && totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} size="small" shape="rounded" />
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, minHeight: "260px", display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <ShoppingCartIcon color="primary" /> Active Bill Basket
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {checkoutError && <Alert severity="error" sx={{ mb: 2 }}>{checkoutError}</Alert>}
            {checkoutSuccess && <Alert severity="success" sx={{ mb: 2 }}>{checkoutSuccess}</Alert>}

            <BillingBasket
              basket={basket}
              checkoutLoading={checkoutLoading}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onCheckoutSubmit={handleCheckoutSubmit}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default SalePersonDashboard