import React from "react";
import "../../CSS/Modal.css";
import { GetDate } from "./Orders";
import { FiX } from "react-icons/fi";

const OrderDetailsModal = ({ order, onClose }) => {
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Order #{order.orderId}</h3>
            <p className="primary-text">{GetDate(order.orderDateAndTime)}</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close"><FiX /></button>
        </div>
        <div className="modal-body">
          <span className="status-pill status-pill--pending" style={{ marginBottom: 16 }}>{order.orderStatus}</span>
          <div className="cart-line-items">
            {order.items.map((item) => (
              <OrderItems key={item.productId} item={item} />
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <div className="cart-summary-row">
            <span>Total quantity</span>
            <span>{order.totalQuantity}</span>
          </div>
          <div className="cart-summary-total">
            <span>Total</span>
            <span>&#8377;{order.totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderItems = ({ item }) => (
  <div className="cart-item-row cart-item-row--static">
    <span className="cart-item-tile">{item.productName.slice(0, 2).toUpperCase()}</span>
    <div className="cart-item-info">
      <h3 className="product-card-name">{item.productName}</h3>
      <span className="primary-text">&#8377;{item.pricePerUnit} each &middot; qty {item.quantity}</span>
    </div>
    <span className="cart-item-amount">&#8377;{item.price}</span>
  </div>
);

export default OrderDetailsModal;
