import React from "react";

const Footer = () => {
  return (
    <footer className="dashboard-footer">
      <span className="nav-logo-mark">C</span>
      <span>&copy; {new Date().getFullYear()} CafeEase &middot; Quality served hot</span>
    </footer>
  );
};

export default Footer;
