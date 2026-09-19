import React, { useEffect, useState } from "react";
import { handleAddToCart } from "../../Services/cart_service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiMinus, FiPlus } from "react-icons/fi";

/**
 * The card is the whole product. Products carry no photo in this schema, so
 * every card gets the same warm initials tile instead of some cards having a
 * picture and others collapsing to a smaller, emptier box.
 */
const Menu = ({ product, cartItemsIdToQuantityMap }) => {
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);
  // Seeded from the cart snapshot fetched once when the page loads, then
  // flipped locally on a successful add -- the snapshot itself is never
  // re-fetched, so relying on it alone would leave the badge stale.
  const [addedHere, setAddedHere] = useState(false);
  const inCart = addedHere || cartItemsIdToQuantityMap.has(product.id);
  const soldOut = product.status !== "true";

  useEffect(() => {
    const productQuantity = cartItemsIdToQuantityMap.get(product.id);
    setQuantity(productQuantity !== undefined ? productQuantity : 1);
  }, [cartItemsIdToQuantityMap, product.id]);

  const addToast = () => {
    toast.success("Added to cart", {
      position: "bottom-left",
      autoClose: 1200,
      theme: "dark",
    });
  };

  const changeQuantity = (delta) => {
    setQuantity((q) => Math.max(1, q + delta));
  };

  const onAdd = async () => {
    setBusy(true);
    try {
      await handleAddToCart(product.id, quantity);
      setAddedHere(true);
      addToast();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`product-card${soldOut ? " product-card--soldout" : ""}`}>
      <div
        className="product-card-tile"
        style={product.image ? { backgroundImage: `url(data:image/jpeg;base64,${product.image})` } : undefined}
      >
        {!product.image && (
          <>
            <span className="product-card-abbr">{product.name.slice(0, 2).toUpperCase()}</span>
            <span className="product-card-tile-label">{product.categoryName}</span>
          </>
        )}
        {soldOut && <span className="status-pill status-pill--sold-out product-card-badge">Sold out today</span>}
      </div>
      <div className="product-card-body">
        <span className="product-card-eyebrow">{product.categoryName}</span>
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-description">{product.description}</p>
        <div className="product-card-footer">
          <span className="product-card-price">&#8377;{product.price}</span>
          {soldOut ? (
            <button className="secondary-button product-card-notify" type="button">Notify me</button>
          ) : (
            <div className="product-card-actions">
              <div className="quantity-stepper">
                <button type="button" onClick={() => changeQuantity(-1)} aria-label="Decrease quantity"><FiMinus /></button>
                <span>{quantity}</span>
                <button type="button" onClick={() => changeQuantity(1)} aria-label="Increase quantity"><FiPlus /></button>
              </div>
              <button
                className={`primary-button product-card-add${inCart ? " product-card-add--in-cart" : ""}`}
                onClick={onAdd}
                disabled={busy}
              >
                {inCart ? "✓ In cart" : "Add"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
