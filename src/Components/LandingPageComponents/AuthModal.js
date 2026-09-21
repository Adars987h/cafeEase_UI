import React from "react";
import { useAuth } from "../../Services/AuthContext";
import AuthForm from "./AuthForm";
import { FiX } from "react-icons/fi";

/**
 * The fallback gate: a guest took a gated action on a page that stays
 * browsable without an account (e.g. "add to cart" on /products). States
 * why it appeared, naming the object -- see requireAuth() callers for the
 * reason text. Dismissing it loses nothing; the page underneath is
 * untouched and stays exactly as it was.
 */
const AuthModal = () => {
  const { gate, closeGate, onAuthSuccess } = useAuth();

  if (!gate.open) return null;

  return (
    <div className="auth-modal-scrim" onClick={closeGate}>
      <div className="auth-modal-panel" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={closeGate} aria-label="Close">
          <FiX />
        </button>
        {gate.reason && <p className="auth-modal-reason">{gate.reason}</p>}
        <AuthForm compact onSuccess={onAuthSuccess} />
      </div>
    </div>
  );
};

export default AuthModal;
