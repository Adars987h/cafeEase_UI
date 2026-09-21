import React, { useEffect, useState } from "react";
import HeroImage from "../../Assets/hero-pizza.jpg";
import AbstractBg from "../../Assets/abstract-bg.svg";
import { FiArrowRight } from "react-icons/fi";
import { fetchCategories } from "../../Services/category_service";
import { productList } from "../../Services/product_service";
import { getTopSellerToday } from "../../Services/order_service";
import useParallax from "../../hooks/useParallax";
import useCursorDrift from "../../hooks/useCursorDrift";
import useCountUp from "../../hooks/useCountUp";

/**
 * The hero used to carry fabricated stats (a star rating with no review
 * system behind it, a "since 2019" price, an average pickup time nothing
 * tracks) and a "today's most ordered" claim with no way to know what
 * actually sells. All of it is real now: catalogue size and starting price
 * come from the public menu endpoints, and the featured dish comes from
 * GET /orders/top-seller (aggregate quantity sold today, no customer data).
 * The count-up animation only changes how a real number arrives on screen,
 * never what it says.
 */
const Stat = ({ value, label, format = (v) => v }) => {
  const [ref, display] = useCountUp(value);
  return (
    <div className="hero-stat" ref={ref}>
      <span className="hero-stat-value">{value == null ? "–" : format(display)}</span>
      <span className="hero-stat-label">{label}</span>
    </div>
  );
};

const Home = () => {
  const [stats, setStats] = useState(null);
  const [topSeller, setTopSeller] = useState(null);
  const imageParallax = useParallax(0.06);
  const cardDrift = useCursorDrift(22);

  useEffect(() => {
    Promise.all([fetchCategories(), productList()])
      .then(([categories, products]) => {
        const prices = (products || []).map((p) => p.price);
        setStats({
          itemCount: products?.length || 0,
          categoryCount: categories?.length || 0,
          minPrice: prices.length ? Math.min(...prices) : null,
        });
      })
      .catch(() => setStats({ itemCount: null, categoryCount: null, minPrice: null }));

    getTopSellerToday()
      .then(setTopSeller)
      .catch(() => setTopSeller(null));
  }, []);

  return (
    <div className="home-container" id="Home">
      <img className="home-abstract-bg" src={AbstractBg} alt="" aria-hidden="true" />
      <div className="home-banner-container">
        <div className="home-text-section">
          <div className="hero-open-badge">
            <span className="hero-open-dot" />
            Open now &middot; 7:00 am &ndash; 11:00 pm &middot; Koramangala 5th Block
          </div>
          <h1 className="primary-heading">
            Good coffee, no <span className="accent-word">queue</span>.
          </h1>
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
            <Stat value={stats?.itemCount} label="Dishes on the menu" />
            <Stat value={stats?.minPrice} label="Starting price" format={(v) => `₹${v}`} />
            <Stat value={stats?.categoryCount} label="Categories to explore" />
          </div>
        </div>
        <div className="home-image-section">
          <img ref={imageParallax} src={HeroImage} alt="Paneer Capsicum Pizza fresh from the counter" />
          {topSeller && (
            <div className="hero-floating-card" ref={cardDrift}>
              <div className="hero-floating-card-text">
                <span className="hero-floating-card-title">{topSeller.productName}</span>
                <span className="hero-floating-card-meta">Today&#39;s most ordered</span>
              </div>
              <span className="hero-floating-card-price">&#8377;{topSeller.price}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
