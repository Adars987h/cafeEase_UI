import React, { useState, useEffect, useMemo } from "react";
import { productList, productListByCategory } from "../../Services/product_service";
import { fetchCategories } from "../../Services/category_service";
import { fetchCart } from "../../Services/cart_service";
import Menu from "./Menu";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate, Link } from "react-router-dom";

const Products = () => {
  const { id: categoryId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [cartItemsIdToQuantityMap, setCartItemsIdToQuantityMap] = useState(new Map());

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchProducts = async () => {
      try {
        const [productsData, categoryData] = await Promise.all([
          categoryId == null ? productList() : productListByCategory(categoryId),
          fetchCategories(),
        ]);
        await setIdToQuantityMapFromCart(setCartItemsIdToQuantityMap);
        setProducts(productsData || []);
        setCategories(categoryData || []);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  const activeCategory = categories.find((c) => String(c.id) === String(categoryId));

  const visibleProducts = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase())),
    [products, search]
  );

  if (error) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon">!</div>
        <p className="empty-state__title">We could not load the menu</p>
        <p className="empty-state__body">
          The kitchen&#39;s server did not answer. Nothing is lost &mdash; your cart is safe.
        </p>
        <div className="hero-cta-row" style={{ justifyContent: "center" }}>
          <button className="secondary-button" onClick={() => window.location.reload()}>Try again</button>
          <Link to="/orders"><button className="text-button">Go to my orders</button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-page-breadcrumb">
        <Link to="/categories">Categories</Link> / {activeCategory ? activeCategory.name : "Menu"}
      </div>
      <div className="products-page-header">
        <div>
          <h1>{activeCategory ? activeCategory.name : "Today's menu"}</h1>
          <p className="primary-text">
            {loading ? "Loading..." : `${visibleProducts.length} item${visibleProducts.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <input
          type="search"
          className="dashboard-search-input"
          placeholder={activeCategory ? `Search in ${activeCategory.name}` : "Search the menu"}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="products-page-chips">
        <button
          className={`filter-chip${!categoryId ? " filter-chip--active" : ""}`}
          onClick={() => navigate("/products")}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            className={`filter-chip${String(c.id) === String(categoryId) ? " filter-chip--active" : ""}`}
            onClick={() => navigate(`/products/category/${c.id}`)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="product-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="product-card skeleton" style={{ height: 320 }} />
          ))}
        </div>
      ) : visibleProducts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">?</div>
          <p className="empty-state__title">Nothing matches &quot;{search}&quot;</p>
          <p className="empty-state__body">Try a different search, or browse everything in this section.</p>
          <button className="secondary-button" onClick={() => setSearch("")}>Clear search</button>
        </div>
      ) : (
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <Menu key={product.id} product={product} cartItemsIdToQuantityMap={cartItemsIdToQuantityMap} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;

async function setIdToQuantityMapFromCart(setCartItemsIdToQuantityMap) {
  const cart = await fetchCart();
  const map = new Map();
  if (cart !== null) {
    cart.items.forEach((item) => {
      map.set(item.productId, item.quantity);
    });
    setCartItemsIdToQuantityMap(map);
  }
}
