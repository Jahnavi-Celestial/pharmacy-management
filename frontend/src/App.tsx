import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { PublicRoute } from "./shared/components/PublicRoute";
import { ProtectedRoute } from "./shared/components/ProtectedRoute";
import Login from "./features/Login/page/Login";
import Home from "./features/Home/page/Home";
import Layout from "./shared/components/Layout";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./shared/hooks/useAuth";
import MedicineDetail from "./features/Medicine/page/MedicineDetail";

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      { path: "/login", element: <Login /> }
    ]
  },
  {
    element: <ProtectedRoute />,
    children: [
      { 
        element: <Layout />,
        children: [
          { path: "/home", element: <Home /> },
          { path: "/medicineDetail/:id", element: <MedicineDetail />}
        ]
      }
    ]
  },
  {
    path: "*",
    element: <Navigate to="/home" replace />
  }
])

export default function App() {
  const { userId } = useAuth()
  
  useEffect(() => {
    if (!userId) return

    const socket = io(import.meta.env.VITE_BACKEND_URL) 
    socket.on("connect", () => {
      console.log(`Connected! Socket ID: ${socket.id}`)
      
      socket.emit("join_room", userId)
    })

    return () => {
      console.log("Disconnecting socket...")
      socket.disconnect()
    }
  }, [userId])

  return (
    <RouterProvider router={router} />
  )
}