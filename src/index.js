import React from "react";
import ReactDOM from "react-dom/client";
import LandingPage from "./Pages/LandingPage";
import ProductsDashBoard from "./Pages/UserProductsPage";
import CartDashboard from "./Pages/UserCartPage"

import {
  createBrowserRouter,
  RouteProvider,
  Route,
  RouterProvider
} from "react-router-dom"


const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },

  {
    path:"/products",
    element: <ProductsDashBoard/>
  },

  {
    path:"/cart",
    element: <CartDashboard/>
  }
]);


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
