import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout(){
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box component="nav">
          <Navbar />
      </Box>

      <Box component="main">
          <Outlet />
      </Box>
    </Box>
  );
}

export default Layout