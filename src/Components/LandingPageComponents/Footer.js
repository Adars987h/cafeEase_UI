import React from "react";
import { BsTwitter } from "react-icons/bs";
import { SiLinkedin } from "react-icons/si";
import { BsYoutube } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="footer-section-one">
        <div className="footer-logo-container">
          <span className="nav-logo-mark">C</span>
          <p id="logo-name">CafeEase</p>
        </div>
        <p className="footer-address">
          122, 5th Block, Koramangala, Bengaluru 560095
          <br />
          +91 80 4123 8890 &middot; hello@cafeease.in
        </p>
        <div className="footer-icons">
          <a href="#Home" aria-label="Twitter"><BsTwitter /></a>
          <a href="#Home" aria-label="LinkedIn"><SiLinkedin /></a>
          <a href="#Home" aria-label="YouTube"><BsYoutube /></a>
          <a href="#Home" aria-label="Facebook"><FaFacebookF /></a>
        </div>
      </div>
      <div className="footer-section-two">
        <div className="footer-section-columns">
          <span className="footer-column-heading">Menu</span>
          <a href="#Category">Dosa</a>
          <a href="#Category">Pizza</a>
          <a href="#Category">Shakes</a>
        </div>
        <div className="footer-section-columns">
          <span className="footer-column-heading">Cafe</span>
          <a href="#Home">Our story</a>
          <a href="#Home">Careers</a>
          <a href="#Contact">Bulk &amp; catering</a>
        </div>
        <div className="footer-section-columns">
          <span className="footer-column-heading">Help</span>
          <a href="#Login">Track an order</a>
          <a href="#Contact">Refunds</a>
          <a href="#Contact">Privacy</a>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} CafeEase &middot; Quality served hot
      </div>
    </footer>
  );
};

export default Footer;
