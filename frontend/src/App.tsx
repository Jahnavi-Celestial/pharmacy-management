import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { PublicRoute } from "./shared/components/PublicRoute";
import { ProtectedRoute } from "./shared/components/ProtectedRoute";
import Login from "./features/Login/page/Login";
import Home from "./features/Home/page/Home";

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
      { path: "/home", element: <Home /> }
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