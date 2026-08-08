import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Box, TextField, Grid, Card, CardContent, CardActionArea, Pagination, CircularProgress, Alert, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import { customerApi } from "../api/customerApi";
import { useAuth } from "../../../shared/hooks/useAuth";

const Customer = () => {
  const navigate = useNavigate()
  const { userRole } = useAuth()

  const [customers, setCustomers] = useState<any[]>([])
  const [search, setSearch] = useState<string>("")
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const limit = 10

  useEffect(() => {
    const fetchCustomers = async () => {
      try{
        setLoading(true)
        setError(null)

        const response = userRole === "ADMIN" ? await customerApi.getAdminCustomers({ page, limit, search }) : await customerApi.getCustomers({ page, limit, search })
          
        setCustomers(response?.data || [])
        setTotalPages(response?.totalPages || 1)
      } 
      catch(err: any){
        setError("Could not retrieve customer account list.")
      } 
      finally{
        setLoading(false)
      }
    }

    const delayDebounceFn = setTimeout(() => {
      fetchCustomers()
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [page, limit, search])

  const handleSearchChange = (e: any) => {
    setSearch(e.target.value)
    setPage(1)
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 }, mt: 10 }}>
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: "primary.main" }}>
          Customer Records
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage pharmacy patient profile records, dynamic lookup queries, and history tracks.
        </Typography>
      </Box>

      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search customers by name or contact parameter..."
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
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box>
      )}

      {error && (
        <Box sx={{ mb: 4 }}><Alert severity="error">{error}</Alert></Box>
      )}

      {!loading && !error && (
        <>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={customer.id}>
                  <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 2 }}>
                    <CardActionArea 
                      onClick={() => navigate(`/customer/${customer.id}`)}
                      sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "stretch" }}
                    >
                      <CardContent sx={{ p: 2.5, flexGrow: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                          <PersonIcon color="primary" />
                          <Typography variant="h6" component="h2" noWrap sx={{ fontWeight: 600, fontSize: "1.1rem" }}>
                            {customer.fullName}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                          <EmailIcon sx={{ fontSize: "0.9rem", color: "text.secondary" }} />
                          <Typography variant="body2" color="text.secondary" noWrap>{customer.email}</Typography>
                        </Box>

                        {customer.phone && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                            <PhoneIcon sx={{ fontSize: "0.9rem", color: "text.secondary" }} />
                            <Typography variant="body2" color="text.secondary" noWrap>{customer.phone}</Typography>
                          </Box>
                        )}
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid size={{ xs: 12 }}>
                <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                  No customer records matched your query parameters.
                </Typography>
              </Grid>
            )}
          </Grid>

          {customers.length > 0 && totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 4, sm: 5 } }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, v) => setPage(v)}
                color="primary"
                size={window.innerWidth < 600 ? "medium" : "large"}
                shape="rounded"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  )
}

export default Customer