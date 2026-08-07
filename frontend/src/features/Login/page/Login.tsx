import { useState } from "react";
import { useAuth } from "../../../shared/hooks/useAuth";
import { authApi } from "../api/authApi";
import { Container, Box, Typography, TextField, Button, Alert, MenuItem, Paper, Link } from "@mui/material";

export default function AuthScreen(){
  const { loginUser } = useAuth()
  
  const [isLogin, setIsLogin] = useState<boolean>(true)
  
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [role, setRole] = useState<string>("SALESPERSON")

  const [errorMsg, setErrorMsg] = useState<string>("")
  const [successMsg, setSuccessMsg] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setErrorMsg("")
    setSuccessMsg("")
    setLoading(true)

    try{
      if(isLogin){
        const response = await authApi.login({ email, password })
        
        loginUser(response.token, { email })
      } 
      else{
        await authApi.register({ name, email, password, role })
        setSuccessMsg("Account created successfully! Please log in.")
        setIsLogin(true)
        
        setName("")
      }
    } 
    catch(err: any){
      setErrorMsg(err.message || "An unexpected error occurred.")
    }
    finally{
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="xs">
      <Box sx={{ marginTop: 25, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Paper elevation={4} sx={{ padding: 4, borderRadius: 3, width: "100%" }}>
          
          <Typography style={{textAlign: "center", fontWeight: "bold", fontSize: "20px"}}>
            {isLogin ? "Pharmacy Login" : "Create Account"}
          </Typography>

          {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
          {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}

          <Box component="form" onSubmit={handleSubmit} >
            
            {!isLogin && ( 
                <TextField margin="normal" required fullWidth label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            )}

            <TextField margin="normal" required fullWidth label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

            <TextField margin="normal" required fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>

            {!isLogin && (
              <TextField select margin="normal" required fullWidth label="Select Role" value={role} onChange={(e) => setRole(e.target.value)}>
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="SALESPERSON">Saleperson</MenuItem>
              </TextField>
            )}

            <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 3, mb: 2, padding: 1.2, fontWeight: "bold" }}>
              {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
            </Button>

            <Box sx={{ textAlignment: "center", mt: 1 }}>
              <Link component="button" type="button" variant="body2" underline="hover"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrorMsg("");
                }}
              >
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </Link>
            </Box>

          </Box>
        </Paper>
      </Box>
    </Container>
  )
}
