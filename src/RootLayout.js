import React from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ColdStartNotice from "./Components/ColdStartNotice";
import AuthModal from "./Components/LandingPageComponents/AuthModal";

// AuthModal needs useNavigate/useLocation (via AuthForm), which only work
// inside the router tree -- rendering it as a RouterProvider sibling throws.
// This layout route gives every page a shared shell with router context.
const RootLayout = () => (
  <>
    <ToastContainer />
    <ColdStartNotice />
    <Outlet />
    <AuthModal />
  </>
);

export default RootLayout;
