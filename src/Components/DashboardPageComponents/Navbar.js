import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { BsCart2 } from "react-icons/bs";
import { HiOutlineBars3 } from "react-icons/hi2";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import LogoutIcon from "@mui/icons-material/Logout";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { logout, getCurrentUser, fetchProfile } from "../../Services/user_service";
import { fetchCart } from "../../Services/cart_service";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(getCurrentUser());
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    fetchCart()
      .then((cart) => {
        if (!mounted || !cart?.items) return;
        setCartCount(cart.items.reduce((sum, item) => sum + item.quantity, 0));
      })
      .catch(() => {});
    fetchProfile().then((profile) => { if (mounted && profile) setUser(profile); });
    return () => { mounted = false; };
  }, []);

  const menuOptions = [
    { text: "Categories", href: "/categories", icon: <LocalDiningIcon /> },
    { text: "Menu", href: "/products", icon: <RestaurantMenuIcon /> },
    { text: "My orders", href: "/orders", icon: <ReceiptLongIcon /> },
    { text: "Cart", href: "/cart", icon: <ShoppingCartRoundedIcon /> },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
    setTimeout(() => {
      toast.success("Logged out successfully", {
        position: "top-left",
        autoClose: 800,
        theme: "dark",
      });
    }, 100);
  };

  return (
    <nav id="dashboard-page-nav">
      <NavLink to="/categories" className="nav-logo-container">
        <span className="nav-logo-mark">C</span>
        <span className="nav-logo-text">CafeEase</span>
      </NavLink>

      <div className="navbar-links-container">
        {menuOptions.slice(0, 3).map((item) => (
          <NavLink
            key={item.text}
            to={item.href}
            className={({ isActive }) => `nav-link${isActive ? " nav-link--active" : ""}`}
          >
            {item.text}
          </NavLink>
        ))}
      </div>

      <div className="navbar-actions-container">
        <NavLink to="/cart" className="nav-cart-button" aria-label="Cart">
          <BsCart2 />
          {cartCount > 0 && <span className="nav-cart-badge">{cartCount}</span>}
        </NavLink>
        {user && (
          <div className="nav-user-chip">
            <span className="nav-user-avatar">{user.initials}</span>
            <span className="nav-user-label">{user.label}</span>
          </div>
        )}
        <button className="text-button" onClick={handleLogout}>Log out</button>
      </div>

      <div className="navbar-menu-container">
        <HiOutlineBars3 onClick={() => setOpenMenu(true)} />
      </div>

      <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor="right">
        <Box
          sx={{ width: 260 }}
          role="presentation"
          onClick={() => setOpenMenu(false)}
          onKeyDown={() => setOpenMenu(false)}
        >
          <List>
            {menuOptions.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={() => navigate(item.href)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon><LogoutIcon /></ListItemIcon>
                <ListItemText primary="Log out" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <div className="dashboard-bottom-nav">
        {menuOptions.map((item) => (
          <NavLink
            key={item.text}
            to={item.href}
            className={({ isActive }) => `dashboard-bottom-nav-item${isActive ? " dashboard-bottom-nav-item--active" : ""}`}
          >
            {item.icon}
            <span>{item.text}</span>
            {item.text === "Cart" && cartCount > 0 && (
              <span className="nav-cart-badge nav-cart-badge--bottom">{cartCount}</span>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
