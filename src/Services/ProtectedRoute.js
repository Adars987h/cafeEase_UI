import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

/**
 * Route guard.
 *
 * Distinguishes "not signed in" from "signed in but not permitted": the first
 * sends you to the landing page to log in, the second to /unauthorized. Sending
 * an anonymous visitor to "unauthorized" tells them they are forbidden when what
 * they actually need is a login form.
 *
 * Also rejects expired tokens. jwtDecode happily decodes an expired JWT, so a
 * role check alone passes long after the token stopped being valid. The API
 * would still reject the calls, leaving a half-rendered page.
 */
const ProtectedRoute = ({ element, allowedRoles }) => {
  const location = useLocation();
  const token = Cookies.get('token');

  if (!token) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  let claims;
  try {
    claims = jwtDecode(token);
  } catch {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  // exp is in seconds; Date.now() is milliseconds.
  if (claims.exp && claims.exp * 1000 <= Date.now()) {
    Cookies.remove('token');
    return <Navigate to="/" replace state={{ from: location.pathname, expired: true }} />;
  }

  if (allowedRoles && !allowedRoles.includes(claims.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return element;
};

export default ProtectedRoute;
