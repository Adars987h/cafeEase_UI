import React from "react";
import ReactDOM from "react-dom/client";
import LandingPage from "./Pages/LandingPage";
import ProductsDashBoard from "./Pages/UserProductsPage";
import CartDashboard from "./Pages/UserCartPage"
import AdminPage from "./Pages/AdminPage";
import Unauthorized from "./Pages/Unauthorized";
import NotFound from "./Pages/NotFound";
import ProtectedRoute from "./Services/ProtectedRoute";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import "./CSS/tokens.css";
import CategoriesDashboard from "./Pages/UserCategoriesPage";
import OrdersDashboard from "./Pages/UserOrdersPage";
import { AuthProvider } from "./Services/AuthContext";
import RootLayout from "./RootLayout";

// Categories and products browse as a guest -- per the 2.0 access-control
// model, menu/prices/categories are public, and only cart/order/bill/admin
// actions are gated. ProtectedRoute would otherwise bounce a guest straight
// to the landing page before they ever see the menu.
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/categories",
        element: <CategoriesDashboard />,
      },
      {
        path: "/products",
        element: <ProductsDashBoard />,
      },
      {
        path: "/products/category/:id",
        element: <ProductsDashBoard />,
      },
      {
        path: "/cart",
        element: <ProtectedRoute element={<CartDashboard />} allowedRoles={['user', 'admin']} />
      },
      {
        path: "/orders",
        element: <ProtectedRoute element={<OrdersDashboard />} allowedRoles={['user', 'admin']} />
      },
      {
        path: "/admin/*",
        element: <ProtectedRoute element={<AdminPage />} allowedRoles={['admin']} />,
      },
      {
        path: "/unauthorized",
        element: <Unauthorized />,
      },
      {
        path: "/*",
        element: <NotFound />,
      },
    ],
  },
]);


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
