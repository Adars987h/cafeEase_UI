import React, { useEffect, useState } from "react";
import { getAllOrdersForUser, getAllOrdersForUserWithSearchRequest } from "../../Services/order_service";
import MyCalendar from "../DashboardPageComponents/Calendar";
import { FiCalendar, FiSearch } from "react-icons/fi";
import { viewBill } from "../../Services/bill_service";
import BillModal from "./BillModal";
import OrderDetailsModal from "./OrderDetailsModal";
import { Link } from "react-router-dom";

/**
 * The backend only ever reports one order status ("Order is Placed") -- there
 * is no cancel/complete/deliver transition wired up server-side. The
 * reference design showed status tabs and coloured pills for delivered /
 * preparing / cancelled; adding that here would be inventing a capability
 * the API does not have, so the list stays a single feed with the date-range
 * and order-id search the backend genuinely supports.
 */
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [showCalendars, setShowCalendars] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleDateChange = (startDate, endDate) => {
    setSelectedStartDate(startDate);
    setSelectedEndDate(endDate);
  };

  const toggleCalendars = () => setShowCalendars((prev) => !prev);

  const searchOrders = async () => {
    try {
      const orders = await getAllOrdersForUserWithSearchRequest(searchText, selectedStartDate, selectedEndDate);
      setOrders(orders || []);
    } catch {
      setOrders([]);
    }
    if (showCalendars) toggleCalendars();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      searchOrders();
    }
  };

  const clearFilters = () => {
    setSearchText("");
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setLoading(true);
    getAllOrdersForUser().then((o) => { setOrders(o || []); setLoading(false); });
  };

  useEffect(() => {
    const getOrders = async () => {
      try {
        const orders = await getAllOrdersForUser();
        setOrders(orders || []);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    getOrders();
  }, []);

  if (error) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon">!</div>
        <p className="empty-state__title">We could not load your orders</p>
        <p className="empty-state__body">Try again in a moment.</p>
      </div>
    );
  }

  const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div className="orders-page">
      <aside className="orders-filter-rail">
        <span className="filter-rail-heading">Date range</span>
        <MyCalendar
          showCalendars={showCalendars}
          toggleCalendars={toggleCalendars}
          onDateChange={handleDateChange}
        />
        <button className="secondary-button orders-calendar-toggle" onClick={toggleCalendars}>
          <FiCalendar /> {showCalendars ? "Hide calendar" : "Pick dates"}
        </button>
        <label className="auth-field">
          <span>Order ID</span>
          <div className="orders-search-input">
            <FiSearch />
            <input
              type="text"
              placeholder="Search by order ID"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </label>
        <div className="hero-cta-row">
          <button className="primary-button" style={{ minHeight: 40 }} onClick={searchOrders}>Apply</button>
          <button className="text-button" onClick={clearFilters}>Clear</button>
        </div>
      </aside>

      <div className="orders-main">
        <div className="orders-main-header">
          <h1>My orders</h1>
          <p className="primary-text">
            {loading ? "Loading..." : `${orders.length} order${orders.length === 1 ? "" : "s"} · ₹${totalSpent} spent`}
          </p>
        </div>

        {loading ? (
          <div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 96, borderRadius: 12, marginBottom: 12 }} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">&#128203;</div>
            <p className="empty-state__title">No orders in this range</p>
            <p className="empty-state__body">Widen the dates, or start something new.</p>
            <div className="hero-cta-row" style={{ justifyContent: "center" }}>
              <button className="secondary-button" onClick={clearFilters}>Clear filter</button>
              <Link to="/products"><button className="text-button">Browse the menu</button></Link>
            </div>
          </div>
        ) : (
          orders.map((order) => <Order key={order.orderId} order={order} />)
        )}
      </div>
    </div>
  );
};

const Order = ({ order }) => {
  const [pdfBlob, setPdfBlob] = useState(null);
  const [showBillModal, setShowBillModal] = useState(false);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);

  const handleBillOpening = async (orderId) => {
    try {
      const blob = await viewBill(orderId);
      setPdfBlob(blob);
      setShowBillModal(true);
    } catch (error) {
      console.error("Error fetching and displaying the PDF", error);
    }
  };

  const handleCloseModal = () => {
    setShowBillModal(false);
    setShowOrderDetailsModal(false);
    setPdfBlob(null);
  };

  return (
    <div className="order-row">
      <div className="order-row-main">
        <div className="order-row-heading">
          <h3 className="product-card-name">#{order.orderId}</h3>
          <span className="status-pill status-pill--pending">{order.orderStatus}</span>
        </div>
        <p className="primary-text">
          {GetDate(order.orderDateAndTime)} &middot; {order.totalQuantity} item{order.totalQuantity === 1 ? "" : "s"}
        </p>
      </div>
      <span className="order-row-amount">&#8377;{order.totalAmount}</span>
      <div className="order-row-actions">
        <button className="text-button" onClick={() => setShowOrderDetailsModal(true)}>View detail</button>
        <button className="text-button" onClick={() => handleBillOpening(order.orderId)}>Download bill</button>
      </div>
      {showBillModal && <BillModal pdfBlob={pdfBlob} onClose={handleCloseModal} />}
      {showOrderDetailsModal && <OrderDetailsModal order={order} onClose={handleCloseModal} />}
    </div>
  );
};

export const GetDate = (dateTime) => {
  const dateObject = new Date(dateTime);
  const year = dateObject.getFullYear();
  const month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
  const day = ("0" + dateObject.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
};

export default Orders;
