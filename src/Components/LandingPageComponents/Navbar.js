/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { HiOutlineBars3 } from "react-icons/hi2";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import LoginIcon from "@mui/icons-material/Login";
import LocalDiningIcon from "@mui/icons-material/LocalDining";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const menuOptions = [
    { text: "Home", href: "#Home", icon: <HomeIcon /> },
    { text: "Categories", href: "#Category", icon: <LocalDiningIcon /> },
    { text: "Contact", href: "#Contact", icon: <PhoneRoundedIcon /> },
    { text: "Log in", href: "#Login", icon: <LoginIcon /> },
  ];

  return (
    <nav id="landing-page-nav">
      <a href="#Home" className="nav-logo-container">
        <span className="nav-logo-mark">C</span>
        <span className="nav-logo-text">CafeEase</span>
      </a>

      <div className="navbar-links-container">
        <a href="#Home" className="nav-link nav-link--active">Home</a>
        <a href="#Category" className="nav-link">Categories</a>
        <a href="#Contact" className="nav-link">Contact</a>
      </div>

      <div className="navbar-actions-container">
        <a href="#Login" className="nav-ghost-button">Log in</a>
        <a href="#Login" className="nav-primary-button">Order now</a>
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
                <ListItemButton href={item.href}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
    </nav>
  );
};

export default Navbar;
