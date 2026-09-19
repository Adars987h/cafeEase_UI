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
import ColdStartNotice from "./Components/ColdStartNotice";
import "./CSS/tokens.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CategoriesDashboard from "./Pages/UserCategoriesPage";
import OrdersDashboard from "./Pages/UserOrdersPage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },

  {
    path: "/categories",
    element: <ProtectedRoute element={<CategoriesDashboard />} allowedRoles={['user', 'admin']} />
  },

  {
    path: "/products",
    element: <ProtectedRoute element={<ProductsDashBoard />} allowedRoles={['user', 'admin']} />
  },

  {
    path: "/products/category/:id",
    element: <ProtectedRoute element={<ProductsDashBoard />} allowedRoles={['user', 'admin']} />
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
    element: <ProtectedRoute element={<AdminPage />} allowedRoles={['admin']} />, // Protecting the admin route
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />, // Adding the unauthorized route
  },
  {
    path: "/*",
    element: <NotFound />, // Adding the notfound route
  }
]);


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer />
      <ColdStartNotice />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);