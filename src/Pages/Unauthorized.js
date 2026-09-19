import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../CSS/NotFound.css"; // shared .status-page styles

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="status-page">
      <span className="status-page-code status-page-code--danger">403</span>
      <h1>You don&#39;t have access to this page</h1>
      <p className="primary-text">
        This area is restricted. If you think this is a mistake, sign in with the right account.
      </p>
      <div className="hero-cta-row">
        <button className="primary-button" onClick={() => navigate("/")}>Go to home</button>
        <button className="secondary-button" onClick={() => navigate(-1)}>Go back</button>
      </div>
    </div>
  );
};

export default Unauthorized;
