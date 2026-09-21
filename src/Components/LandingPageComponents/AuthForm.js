import React, { useState } from "react";
import { signUp, login, forgotPassword } from "../../Services/user_service";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../../Services/AuthContext";

/**
 * The login/register/forgot-password logic, shared by two shells: the
 * always-open panel on the landing page (Login_Register.js) and the
 * fallback gate modal (AuthModal.js) used for a guest action taken
 * elsewhere in the app. Only the chrome around this differs; the fields,
 * validation and API calls must not be duplicated between them.
 *
 * `onSuccess`, when provided, is called instead of the default
 * role-based navigation -- the gate modal uses this to replay the intent
 * that opened it rather than navigating away from the page the user was on.
 */
const AuthForm = ({ onSuccess, initialMode = "login", compact = false }) => {
  const [mode, setMode] = useState(initialMode);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { onAuthSuccess } = useAuth();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login({ email, password });
      if (onSuccess) {
        // The modal path: onSuccess IS onAuthSuccess (refreshes auth state
        // and replays the intent that opened the gate). Calling both this
        // and the unconditional onAuthSuccess() below would replay the
        // intent twice -- exactly what double-added an item to the cart.
        onSuccess();
        return;
      }
      onAuthSuccess();
      const token = Cookies.get("token");
      const decoded = token ? jwtDecode(token) : null;
      const redirectTo = location.state?.from;
      if (redirectTo && decoded?.role !== "admin") {
        navigate(redirectTo);
      } else if (decoded?.role === "admin") {
        navigate("/admin");
      } else if (decoded?.role === "user") {
        navigate("/products");
      }
    } catch (error) {
      console.log("Error from login:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setSubmitting(true);
    forgotPassword({ email })
      .then((resp) => {
        setResetSent(true);
        toast.success(resp?.message || "Check your mail for credentials", {
          position: "bottom-left",
          autoClose: 2000,
          theme: "dark",
        });
      })
      .catch(() => {
        toast.error("Something went wrong", {
          position: "bottom-left",
          autoClose: 2000,
          theme: "dark",
        });
      })
      .finally(() => setSubmitting(false));
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = { name, email, contactNumber: contact, password };

    signUp(payload)
      .then(() => {
        toast.success("Account created. You can log in now.", {
          position: "bottom-left",
          autoClose: 2000,
          theme: "dark",
        });
        setMode("login");
        setPassword("");
      })
      .catch(() => {
        toast.error("Something went wrong", {
          position: "bottom-left",
          autoClose: 2000,
          theme: "dark",
        });
      })
      .finally(() => setSubmitting(false));
  };

  const switchMode = (next) => {
    setMode(next);
    setResetSent(false);
  };

  return (
    <div className={`auth-form-panel ${compact ? "auth-form-panel--compact" : ""}`}>
      <div className="auth-card-header">
        <p className="primary-subheading">Your usual, waiting.</p>
        <h2>
          {mode === "forgot" ? "Reset your password" : mode === "register" ? "Create your account" : "Sign in to reorder in two taps"}
        </h2>
      </div>

      {mode !== "forgot" && (
        <div className="auth-toggle" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "login"}
            className={`auth-toggle-btn ${mode === "login" ? "auth-toggle-btn--active" : ""}`}
            onClick={() => switchMode("login")}
          >
            Log in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "register"}
            className={`auth-toggle-btn ${mode === "register" ? "auth-toggle-btn--active" : ""}`}
            onClick={() => switchMode("register")}
          >
            Register
          </button>
        </div>
      )}

      {mode === "login" && (
        <form className="auth-form" onSubmit={handleLoginSubmit}>
          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="auth-field">
            <div className="auth-field-label-row">
              <span>Password</span>
              <button type="button" className="auth-inline-link" onClick={() => switchMode("forgot")}>
                Forgot?
              </button>
            </div>
            <div className="auth-password-input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </label>
          <button className="primary-button auth-submit" type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Log in"}
          </button>
          <p className="auth-switch-line">
            New here?{" "}
            <button type="button" className="auth-inline-link" onClick={() => switchMode("register")}>
              Create an account
            </button>
          </p>
        </form>
      )}

      {mode === "register" && (
        <form className="auth-form" onSubmit={handleRegisterSubmit}>
          <label className="auth-field">
            <span>Full name</span>
            <input
              type="text"
              placeholder="Aarav Mehta"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              placeholder="aarav.mehta@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="auth-field">
            <span>Contact number</span>
            <input
              type="tel"
              placeholder="98450 33127"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />
          </label>
          <label className="auth-field">
            <span>Password</span>
            <div className="auth-password-input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="&bull;&bull;&bull;&bull;"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <span className="auth-field-hint">Use at least 8 characters</span>
          </label>
          <button className="primary-button auth-submit" type="submit" disabled={submitting}>
            {submitting ? "Creating account..." : "Create account"}
          </button>
          <p className="auth-switch-line">
            Already have an account?{" "}
            <button type="button" className="auth-inline-link" onClick={() => switchMode("login")}>
              Log in
            </button>
          </p>
        </form>
      )}

      {mode === "forgot" && (
        <form className="auth-form" onSubmit={handleForgotPassword}>
          <p className="auth-form-intro">
            Tell us the email on your account and we will send your credentials there.
          </p>
          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <button className="primary-button auth-submit" type="submit" disabled={submitting}>
            {submitting ? "Sending..." : "Send reset link"}
          </button>
          {resetSent && (
            <p className="auth-success-line">
              &#10003; Sent. Check {email || "your inbox"} &mdash; including spam.
            </p>
          )}
          <p className="auth-switch-line">
            <button type="button" className="auth-inline-link" onClick={() => switchMode("login")}>
              Back to log in
            </button>
          </p>
        </form>
      )}
    </div>
  );
};

export default AuthForm;
