import React, { useState, useEffect } from "react";
import { fetchCategories } from "../../Services/category_service";
import { productList } from "../../Services/product_service";
import { useNavigate } from "react-router-dom";

/**
 * Was a bare grid of category art with no sense of what is inside each one.
 * Now a real index: item count and price floor per category, computed from
 * the live product list (the category endpoint alone does not carry either),
 * so it answers "what's here, what will it cost" before a single tap.
 */
const Category = () => {
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [categoryData, productData] = await Promise.all([
          fetchCategories(),
          productList().catch(() => []),
        ]);
        const byCategory = {};
        (productData || []).forEach((p) => {
          const bucket = (byCategory[p.categoryId] ||= { count: 0, activeCount: 0, minPrice: null });
          bucket.count += 1;
          if (p.status === "true") {
            bucket.activeCount += 1;
            if (bucket.minPrice === null || p.price < bucket.minPrice) {
              bucket.minPrice = p.price;
            }
          }
        });
        setCategories(categoryData || []);
        setStats(byCategory);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  if (error) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon">!</div>
        <p className="empty-state__title">We could not load the categories</p>
        <p className="empty-state__body">The kitchen&#39;s server did not answer. Try again in a moment.</p>
        <button className="secondary-button" onClick={() => window.location.reload()}>Try again</button>
      </div>
    );
  }

  return (
    <div className="categories-page">
      <div className="dashboard-search-row">
        <input
          type="search"
          className="dashboard-search-input"
          placeholder="Search the whole menu"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="category-section-bottom">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="category-tile skeleton" style={{ height: 132 }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">?</div>
          <p className="empty-state__title">No categories match &quot;{search}&quot;</p>
          <p className="empty-state__body">Try a different search, or clear it to see everything.</p>
          <button className="secondary-button" onClick={() => setSearch("")}>Clear search</button>
        </div>
      ) : (
        <div className="category-section-bottom">
          {filtered.map((category) => (
            <CategoryTile key={category.id} category={category} stats={stats[category.id]} />
          ))}
        </div>
      )}
    </div>
  );
};

const CategoryTile = ({ category, stats }) => {
  const navigate = useNavigate();
  const hasStock = stats && stats.activeCount > 0;

  return (
    <button
      className={`category-tile category-tile--button${hasStock ? "" : " category-tile--paused"}`}
      onClick={() => hasStock && navigate(`/products/category/${category.id}`)}
      disabled={!hasStock}
    >
      <span className="category-tile-abbr">{category.name.slice(0, 3)}</span>
      <span className="category-tile-name">{category.name}</span>
      <span className="category-tile-meta">
        {hasStock
          ? `${stats.activeCount} item${stats.activeCount === 1 ? "" : "s"} · from ₹${stats.minPrice}`
          : "Nothing available right now"}
      </span>
      {!hasStock && <span className="status-pill status-pill--sold-out category-tile-status">Paused</span>}
    </button>
  );
};

export default Category;
