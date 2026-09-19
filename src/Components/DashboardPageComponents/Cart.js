import React, { useState, useEffect } from "react";
import { fetchCart, handleAddToCart } from "../../Services/cart_service";
import { placeOrderFromCart } from "../../Services/order_service";
import useDebounce from "../../Services/helper";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { FiMinus, FiPlus, FiX } from "react-icons/fi";

/**
 * Was floated boxes with the total lost in the flow. Line items sit left, a
 * sticky order summary sits right, and the total is the one number set in
 * display type -- it is the one number anyone reads twice.
 *
 * The summary shows only what the backend actually charges (item total).
 * The reference design also showed invented "taxes" and "first-order
 * discount" lines; this app does not compute either, so adding them would
 * show a number the customer is not actually charged.
 */
const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getCart = async () => {
      try {
        const cart = await fetchCart();
        setCart(cart);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    getCart();
  }, []);

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      await placeOrderFromCart();
      toast.success("Order placed", {
        position: "bottom-left",
        autoClose: 1200,
        theme: "dark",
      });
      const cart = await fetchCart();
      setCart(cart);
      navigate("/orders");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="cart-page">
        <div className="cart-page-grid">
          <div className="cart-line-items">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 84, borderRadius: 12, marginBottom: 12 }} />
            ))}
          </div>
          <div className="skeleton" style={{ height: 220, borderRadius: 18 }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon">!</div>
        <p className="empty-state__title">We could not load your cart</p>
        <p className="empty-state__body">Try again in a moment.</p>
      </div>
    );
  }

  if (IsCartEmpty(cart)) {
    return (
      <div className="cart-page">
        <h1>Your cart</h1>
        <div className="empty-state">
          <div className="empty-state__icon">&#128722;</div>
          <p className="empty-state__title">Nothing in here yet</p>
          <p className="empty-state__body">
            Most people start with a chai and something to go with it. We do not judge.
          </p>
          <Link to="/products"><button className="primary-button">Browse the menu</button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your cart</h1>
      <p className="primary-text">{cart.items.length} item{cart.items.length === 1 ? "" : "s"}</p>

      <div className="cart-page-grid">
        <div className="cart-line-items">
          {cart.items.map((item) => (
            <CartItems key={item.productId} item={item} setCart={setCart} />
          ))}
        </div>

        <div className="cart-summary-card">
          <h3>Order summary</h3>
          <div className="cart-summary-row">
            <span>Items ({cart.items.reduce((sum, i) => sum + i.quantity, 0)})</span>
            <span>&#8377;{cart.totalAmount}</span>
          </div>
          <div className="cart-summary-total">
            <span>Total</span>
            <span>&#8377;{cart.totalAmount}</span>
          </div>
          <button className="primary-button auth-submit" onClick={handlePlaceOrder} disabled={placing}>
            {placing ? "Placing order..." : "Place order"}
          </button>
        </div>
      </div>
    </div>
  );
};

const IsCartEmpty = (cart) => {
  return cart == null || cart.items == null || cart.items.length === 0;
};

const CartItems = ({ item, setCart }) => {
  const [inputValue, setInputValue] = useState(item.quantity);
  const debouncedQuantity = useDebounce(inputValue, 800);

  useEffect(() => {
    setInputValue(item.quantity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.quantity]);

  useEffect(() => {
    if (debouncedQuantity !== item.quantity) {
      handleQuantityChange(debouncedQuantity);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuantity]);

  const handleQuantityChange = async (qty) => {
    if (qty <= 0) {
      toast.info("Item removed", {
        position: "bottom-left",
        autoClose: 1000,
        theme: "dark",
      });
    }
    const cart = await handleAddToCart(item.productId, qty);
    setCart(cart);
  };

  const handleRemoveFromCart = async (productId) => {
    toast.info("Item removed", {
      position: "bottom-left",
      autoClose: 1000,
      theme: "dark",
    });
    const updatedCart = await handleAddToCart(productId, 0);
    setCart(updatedCart);
  };

  return (
    <div className="cart-item-row">
      <span className="cart-item-tile">{item.productName.slice(0, 2).toUpperCase()}</span>
      <div className="cart-item-info">
        <h3 className="product-card-name">{item.productName}</h3>
        <span className="primary-text">&#8377;{item.pricePerUnit} each</span>
      </div>
      <div className="quantity-stepper">
        <button type="button" onClick={() => setInputValue((q) => Math.max(0, q - 1))} aria-label="Decrease quantity"><FiMinus /></button>
        <span>{inputValue}</span>
        <button type="button" onClick={() => setInputValue((q) => q + 1)} aria-label="Increase quantity"><FiPlus /></button>
      </div>
      <span className="cart-item-amount">&#8377;{item.price}</span>
      <button className="cart-item-remove" onClick={() => handleRemoveFromCart(item.productId)} aria-label="Remove item">
        <FiX />
      </button>
    </div>
  );
};

export default Cart;
