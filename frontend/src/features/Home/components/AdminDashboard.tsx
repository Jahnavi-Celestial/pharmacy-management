import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Box, TextField, Grid, Pagination, CircularProgress, Alert, InputAdornment, FormControl, Select, MenuItem } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { medicineApi } from "../../Medicine/api/medicineApi";
import { MedicineCard, type MedicineItem } from "../../Medicine/components/MedicineCard";

const AdminDashboard = () => {
  const navigate = useNavigate()

  const [search, setSearch] = useState<string>("")
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [medicines, setMedicines] = useState<MedicineItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMedicines = async () => {
    try{
      setLoading(true)
      setError(null)

      const response = await medicineApi.getAll(page, limit, search)

      setMedicines(response.data || [])
      setTotalPages(response.totalPages || 1)
    } 
    catch(err: any){
      console.error("Dashboard inventory fetch failed:", err)
      setError("Could not retrieve pharmacy inventory. Please verify admin authorization.")
    } 
    finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMedicines()
    }, 300)

    return () => clearTimeout(timer)
  }, [page, limit, search])

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

  const handleCardClick = (id: string) => {
    navigate(`/medicineDetail/${id}`)
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
      <Box sx={{ mb: { xs: 3, sm: 4 }, textAlign: { xs: "center", sm: "left" } }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: "bold", 
            color: "primary.main",
            fontSize: { xs: "1.75rem", sm: "2.125rem" }
          }}
        >
          Welcome back, Admin!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
          Manage your central pharmacy medicines and live inventory availability.
        </Typography>
      </Box>

      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <TextField
            fullWidth
            variant="outlined"
            placeholder="Search medicines..."
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
            {medicines.length > 0 ? (
              medicines.map((item) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                  <MedicineCard item={item} onClick={handleCardClick} />
                </Grid>
              ))
            ) : (
              <Grid size={{ xs: 12 }}>
                <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                  No medications found matching your criteria.
                </Typography>
              </Grid>
            )}
          </Grid>

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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
        </>
      )}
    </Container>
  )
}

export default AdminDashboard
