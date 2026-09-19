import React, { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { fetchCategories } from "../../Services/category_service";
import { productList } from "../../Services/product_service";

/**
 * Was a hardcoded snapshot of category names, counts and starting prices --
 * accurate the moment it was written, silently stale the moment an admin
 * added, removed or repriced anything. Now fetches the same public
 * /category and /product endpoints the post-login menu uses and computes
 * counts/floors from the live catalogue.
 */
const Category = () => {
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

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
    <div className="category-section-wrapper" id="Category">
      <div className="category-section-top">
        <p className="primary-subheading">The counter</p>
        <h2>What&#39;s on the menu</h2>
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
              return (
                <a href="#Login" className="category-tile" key={cat.id}>
                  <span className="category-tile-abbr">{cat.name.slice(0, 3)}</span>
                  <span className="category-tile-name">{cat.name}</span>
                  <span className="category-tile-meta">
                    {stat && stat.count > 0
                      ? `${stat.count} items · from ₹${stat.minPrice}`
                      : "Back soon"}
                  </span>
                  <FiArrowRight className="category-tile-arrow" />
                </a>
              );
            })}
      </div>
    </div>
  );
};

export default Category;
