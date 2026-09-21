import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { fetchCategories } from "../../Services/category_service";
import { productList } from "../../Services/product_service";
import useInViewAnimation from "../../hooks/useInViewAnimation";

/**
 * Was a hardcoded snapshot of category names, counts and starting prices --
 * accurate the moment it was written, silently stale the moment an admin
 * added, removed or repriced anything. Now fetches the same public
 * /category and /product endpoints the post-login menu uses and computes
 * counts/floors from the live catalogue.
 *
 * Tiles link straight into /products/category/:id rather than back to the
 * login panel -- browsing the menu is public per the 2.0 access model, so
 * a guest should land on the real menu, not get funnelled into signing in
 * before they have even seen what's on it.
 */
const Category = () => {
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const revealRef = useInViewAnimation();

  useEffect(() => {
    Promise.all([fetchCategories(), productList()])
      .then(([categoryData, products]) => {
        const byCategory = {};
        (products || []).forEach((p) => {
          const bucket = (byCategory[p.categoryId] ||= { count: 0, minPrice: null });
          if (p.status === "true") {
            bucket.count += 1;
            if (bucket.minPrice === null || p.price < bucket.minPrice) {
              bucket.minPrice = p.price;
            }
          }
        });
        setCategories(categoryData || []);
        setStats(byCategory);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="category-section-wrapper" id="Category" ref={revealRef}>
      <div className="category-section-top">
        <p className="primary-subheading">The counter</p>
        <h2>
          What&#39;s on the <span className="accent-word">menu</span>
        </h2>
        <p className="primary-text">
          {loading
            ? "Loading the menu..."
            : `${categories.length} sections, cooked to order.`}
        </p>
      </div>
      <div className="category-section-bottom">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="category-tile skeleton" style={{ height: 132 }} />
            ))
          : categories.map((cat) => {
              const stat = stats[cat.id];
              const hasStock = stat && stat.count > 0;
              return (
                <Link
                  to={hasStock ? `/products/category/${cat.id}` : "#"}
                  className={`category-tile${hasStock ? "" : " category-tile--paused"}`}
                  key={cat.id}
                  aria-disabled={!hasStock}
                >
                  <span className="category-tile-abbr">{cat.name.slice(0, 3)}</span>
                  <span className="category-tile-name">{cat.name}</span>
                  <span className="category-tile-meta">
                    {hasStock ? `${stat.count} items · from ₹${stat.minPrice}` : "Back soon"}
                  </span>
                  <FiArrowRight className="category-tile-arrow" />
                </Link>
              );
            })}
      </div>
      <div className="category-section-cta">
        <Link to="/products" className="secondary-button">
          Browse the full menu <FiArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default Category;
