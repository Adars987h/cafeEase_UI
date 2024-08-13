import React from "react";
import ReactDOM from "react-dom/client";
import LandingPage from "./Pages/LandingPage";
import ProductsDashBoard from "./Pages/UserProductsPage";
import CartDashboard from "./Pages/UserCartPage"

import { createBrowserRouter, RouteProvider, Route, RouterProvider } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OrdersDashboard from "./Pages/UserOrdersPage";
import CategoriesDashboard from "./Pages/UserCategoriesPage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },

  {
    path: "/categories",
    element: <CategoriesDashboard />
  },

  {
    path: "/products",
    element: <ProductsDashBoard />
  },

  {
    path: "/products/category/:id",
    element: <ProductsDashBoard/>
  },

  {
    path: "/cart",
    element: <CartDashboard />
  },

  {
    path: "/orders",
    element: <OrdersDashboard />
  }
]);


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ToastContainer />
    <RouterProvider router={router} />
  </React.StrictMode>
);