import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useSocket } from "../hooks/useSocket";

function Layout(){
  const socket = useSocket()

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box component="nav">
          <Navbar socket={socket}/>
      </Box>

      <Box component="main">
          <Outlet />
      </Box>
    </Box>
  );
}

export default Layout