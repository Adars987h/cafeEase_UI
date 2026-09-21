import React, { createContext, useCallback, useContext, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

/**
 * The one gate, one modal, one rule set described in the 2.0 access-control
 * spec -- but the landing page itself is the primary, always-open entry
 * point (see AuthPanel), not this modal. This context exists for the
 * secondary case: a guest takes a gated action (add to cart, place order)
 * on a page that stays browsable without an account, e.g. /products.
 *
 * requireAuth(reason, intent) runs `intent` immediately if already signed
 * in. Otherwise it captures both and opens the shared modal; on successful
 * login the captured intent replays automatically so the user lands where
 * they were trying to go, and on dismissal nothing is lost -- the page
 * underneath stays exactly as it was.
 */
const AuthContext = createContext(null);

const readUser = () => {
  const token = Cookies.get("token");
  if (!token) return null;
  try {
    const claims = jwtDecode(token);
    if (claims.exp && claims.exp * 1000 <= Date.now()) return null;
    return { email: claims.sub, role: claims.role };
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readUser);
  const [gate, setGate] = useState({ open: false, reason: "", intent: null });

  const refreshUser = useCallback(() => setUser(readUser()), []);

  const requireAuth = useCallback((reason, intent) => {
    const current = readUser();
    if (current) {
      intent?.();
      return true;
    }
    setGate({ open: true, reason, intent });
    return false;
  }, []);

  const closeGate = useCallback(() => setGate({ open: false, reason: "", intent: null }), []);

  const onAuthSuccess = useCallback(() => {
    refreshUser();
    const pending = gate.intent;
    closeGate();
    pending?.();
  }, [gate.intent, refreshUser, closeGate]);

  const logout = useCallback(() => {
    Cookies.remove("token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, refreshUser, requireAuth, gate, closeGate, onAuthSuccess, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
