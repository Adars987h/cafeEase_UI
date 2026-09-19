import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import DescriptionIcon from "@mui/icons-material/Description";
import LogoutIcon from "@mui/icons-material/Logout";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { logout, getCurrentUser, fetchProfile } from "../../Services/user_service";
import { adminProductList } from "../../Services/product_service";
import { fetchCategories } from "../../Services/category_service";
import { getAllUsers } from "../../Services/user_service";
import { getAllOrdersForUser } from "../../Services/order_service";

/**
 * Was a vertical list of plain text links. Now an ink sidebar so the admin
 * area reads as a distinct workspace from the customer-facing site, with
 * live counts pulled from the same endpoints each page already calls.
 */
const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [counts, setCounts] = useState({ products: null, categories: null, users: null, orders: null });

  useEffect(() => {
    let mounted = true;
    fetchProfile().then((profile) => { if (mounted && profile) setUser(profile); });

    Promise.all([
      adminProductList().catch(() => []),
      fetchCategories().catch(() => []),
      getAllUsers().catch(() => []),
      getAllOrdersForUser().catch(() => []),
    ]).then(([products, categories, users, orders]) => {
      if (!mounted) return;
      setCounts({
        products: products?.length ?? 0,
        categories: categories?.length ?? 0,
        users: users?.length ?? 0,
        orders: orders?.length ?? 0,
      });
    });

    return () => { mounted = false; };
  }, []);

  const navItems = [
    { text: "Dashboard", href: "/admin", icon: <DashboardIcon fontSize="small" />, end: true },
    { text: "Products", href: "/admin/products", icon: <RestaurantMenuIcon fontSize="small" />, count: counts.products },
    { text: "Categories", href: "/admin/category", icon: <LocalDiningIcon fontSize="small" />, count: counts.categories },
    { text: "Users", href: "/admin/user", icon: <PeopleAltIcon fontSize="small" />, count: counts.users },
    { text: "Orders", href: "/admin/order", icon: <ReceiptLongIcon fontSize="small" />, count: counts.orders },
    { text: "Bills", href: "/admin/bill", icon: <DescriptionIcon fontSize="small" /> },
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
    <nav className="admin-page-nav">
      <div className="admin-nav-brand">
        <span className="nav-logo-mark">C</span>
        <div>
          <div className="admin-nav-brand-name">CafeEase</div>
          <div className="admin-nav-brand-sub">Manager console</div>
        </div>
      </div>

      <ul className="admin-nav-list">
        {navItems.map((item) => (
          <li key={item.text}>
            <NavLink
              to={item.href}
              end={item.end}
              className={({ isActive }) => `admin-nav-link${isActive ? " admin-nav-link--active" : ""}`}
            >
              {item.icon}
              <span>{item.text}</span>
              {item.count != null && <span className="admin-nav-count">{item.count}</span>}
            </NavLink>
          </li>
        ))}
      </ul>

      {user && (
        <div className="admin-nav-user">
          <span className="nav-user-avatar">{user.initials}</span>
          <div className="admin-nav-user-info">
            <div className="admin-nav-user-name">{user.label}</div>
            <div className="admin-nav-user-role">Store manager</div>
          </div>
          <button className="admin-nav-logout" onClick={handleLogout} aria-label="Log out">
            <LogoutIcon fontSize="small" />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
