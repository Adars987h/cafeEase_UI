import React from "react";
import LoginPanelImage from "../../Assets/login-chai.jpg";
import AuthForm from "./AuthForm";

/**
 * The always-open login/signup panel, permanently visible as a landing-page
 * section rather than behind a modal or a separate route -- the primary,
 * friendly entry point into the app. Guest actions taken elsewhere (e.g.
 * "add to cart" on /products) still fall back to AuthModal.
 */
const Login_Register = () => (
  <div className="auth-section-wrapper" id="Login">
    <div className="auth-card">
      <AuthForm />
      <div className="auth-image-panel">
        <img src={LoginPanelImage} alt="" />
      </div>
    </div>
  </div>
);

export default Login_Register;
