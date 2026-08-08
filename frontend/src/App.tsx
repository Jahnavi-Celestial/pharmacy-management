import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { PublicRoute } from "./shared/components/PublicRoute";
import { ProtectedRoute } from "./shared/components/ProtectedRoute";
import Login from "./features/Login/page/Login";
import Home from "./features/Home/page/Home";
import Layout from "./shared/components/Layout";
import MedicineDetail from "./features/Medicine/page/MedicineDetail";
import InventoryDetail from "./features/Inventory/page/InventoryDetail";
import Inventory from "./features/Inventory/page/Inventory";
import Customer from "./features/Customer/page/Customer";
import CustomerDetail from "./features/Customer/page/CustomerDetail";
import SaleHistory from "./features/SaleHistory/page/SaleHistory";
import SaleDetail from "./features/SaleHistory/page/SaleDetail";

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
          { path: "/medicineDetail/:id", element: <MedicineDetail />},
          { path: "/inventory", element: <Inventory />},
          { path: "/inventory/:id", element: <InventoryDetail />},
          { path: "/customer", element: <Customer />},
          { path: "/customer/:id", element: <CustomerDetail />},
          { path: "/sale", element: <SaleHistory />},
          { path: "/sale/:id", element: <SaleDetail />},
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
  return (
    <RouterProvider router={router} />
  )
}