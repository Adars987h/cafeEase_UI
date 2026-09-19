import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../CSS/NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="status-page">
      <span className="status-page-code">404</span>
      <h1>Page not found</h1>
      <p className="primary-text">
        The page you are looking for might have been moved, renamed, or never existed.
      </p>
      <div className="hero-cta-row">
        <button className="primary-button" onClick={() => navigate("/")}>Back to home</button>
        <button className="secondary-button" onClick={() => navigate(-1)}>Go back</button>
      </div>
    </div>
  );
};

export default NotFound;
