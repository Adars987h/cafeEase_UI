import React from "react";
import HeroImage from "../../Assets/home-banner-image.png";
import { FiArrowRight } from "react-icons/fi";

/**
 * The hero used to be a decorative blob behind one generic sentence. This
 * version sells a specific counter: hours, a location, a price entry point,
 * and today's most-ordered item, so a first-time visitor knows what they are
 * about to order before they scroll any further.
 */
const Home = () => {
  return (
    <div className="home-container" id="Home">
      <div className="home-banner-container">
        <div className="home-text-section">
          <div className="hero-open-badge">
            <span className="hero-open-dot" />
            Open now &middot; 7:00 am &ndash; 11:00 pm &middot; Koramangala 5th Block
          </div>
          <h1 className="primary-heading">Good coffee, no queue.</h1>
          <p className="primary-text">
            Order ahead from the counter menu &mdash; chai, filter coffee, wood-fired
            pizza and everything in between. Pay in the app, pick it up warm.
          </p>
          <div className="hero-cta-row">
            <a href="#Login">
              <button className="primary-button">
                Browse the menu <FiArrowRight />
              </button>
            </a>
            <a href="#Category">
              <button className="secondary-button">See today&#39;s specials</button>
            </a>
          </div>
          <div className="hero-stat-row">
            <div className="hero-stat">
              <span className="hero-stat-value">4.7 &#9733;</span>
              <span className="hero-stat-label">1,240 ratings</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">&#8377;60</span>
              <span className="hero-stat-label">Chai, since 2019</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">8 min</span>
              <span className="hero-stat-label">Average pickup</span>
            </div>
          </div>
        </div>
        <div className="home-image-section">
          <img src={HeroImage} alt="Wood-fired pizza fresh from the counter" />
          <div className="hero-floating-card">
            <div className="hero-floating-card-text">
              <span className="hero-floating-card-title">Corn &amp; Capsicum Pizza</span>
              <span className="hero-floating-card-meta">Today&#39;s most ordered</span>
            </div>
            <span className="hero-floating-card-price">&#8377;199</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
