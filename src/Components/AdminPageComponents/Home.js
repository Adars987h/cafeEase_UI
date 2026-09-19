import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminProductList } from "../../Services/product_service";
import { getAllOrdersForUser } from "../../Services/order_service";
import { GetDate } from "../DashboardPageComponents/Orders";

/**
 * Was a page that said "Hii this is the home page for admin". Built around
 * the questions a manager actually opens this for: money in, orders moving,
 * what needs attention, what is selling.
 *
 * There is no cancel/deliver transition wired up server side (see the
 * backend commit history), so "Cancelled" always reads 0 here -- that is the
 * real number, not a placeholder. There is also no per-hour analytics
 * table; "orders by hour" is computed client side from the orders already
 * fetched for the day.
 */
const isToday = (dateTime) => {
  const d = new Date(dateTime);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminProductList().catch(() => []),
      getAllOrdersForUser().catch(() => []),
    ]).then(([productData, orderData]) => {
      setProducts(productData || []);
      setOrders(orderData || []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="admin-dashboard-page">
        <div className="admin-metric-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 96, borderRadius: 12 }} />
          ))}
        </div>
      </div>
    );
  }

  const todaysOrders = orders.filter((o) => isToday(o.orderDateAndTime));
  const revenue = todaysOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const avgOrder = todaysOrders.length ? Math.round(revenue / todaysOrders.length) : 0;

  const hourBuckets = Array.from({ length: 24 }, () => 0);
  todaysOrders.forEach((o) => {
    hourBuckets[new Date(o.orderDateAndTime).getHours()] += 1;
  });
  const maxBucket = Math.max(1, ...hourBuckets);
  const activeHours = [7, 9, 11, 13, 15, 17, 19, 21, 23];

  const soldOut = products.filter((p) => p.status !== "true");
  const soldProductNames = new Set();
  const salesByName = {};
  orders.forEach((o) => {
    (o.items || []).forEach((item) => {
      soldProductNames.add(item.productName);
      salesByName[item.productName] = (salesByName[item.productName] || 0) + item.quantity;
    });
  });
  const neverSold = products.filter((p) => p.status === "true" && !soldProductNames.has(p.name));
  const topSellers = Object.entries(salesByName)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.orderDateAndTime) - new Date(a.orderDateAndTime))
    .slice(0, 5);

  return (
    <div className="admin-dashboard-page">
      <div className="admin-page-header">
        <div>
          <h1>Today, {new Date().toLocaleDateString(undefined, { day: "numeric", month: "long" })}</h1>
          <p className="primary-text">{todaysOrders.length} order{todaysOrders.length === 1 ? "" : "s"} so far today</p>
        </div>
      </div>

      <div className="admin-metric-grid">
        <div className="admin-metric-card">
          <span className="filter-rail-heading">Revenue</span>
          <span className="admin-metric-value">&#8377;{revenue}</span>
        </div>
        <div className="admin-metric-card">
          <span className="filter-rail-heading">Orders</span>
          <span className="admin-metric-value">{todaysOrders.length}</span>
        </div>
        <div className="admin-metric-card">
          <span className="filter-rail-heading">Average order</span>
          <span className="admin-metric-value">&#8377;{avgOrder}</span>
        </div>
        <div className="admin-metric-card">
          <span className="filter-rail-heading">Cancelled</span>
          <span className="admin-metric-value">0</span>
        </div>
      </div>

      <div className="admin-dashboard-columns">
        <div className="admin-panel">
          <h3>Orders by hour</h3>
          <div className="admin-bar-chart">
            {activeHours.map((h) => (
              <div key={h} className="admin-bar-chart-col">
                <div
                  className="admin-bar-chart-bar"
                  style={{ height: `${Math.max(4, (hourBuckets[h] / maxBucket) * 100)}%` }}
                  title={`${hourBuckets[h]} orders`}
                />
                <span className="admin-bar-chart-label">{h % 12 === 0 ? 12 : h % 12}{h < 12 ? "a" : "p"}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-panel">
          <h3>Needs attention</h3>
          {soldOut.length === 0 && neverSold.length === 0 ? (
            <p className="primary-text">Nothing needs attention right now.</p>
          ) : (
            <ul className="admin-attention-list">
              {soldOut.map((p) => (
                <li key={`soldout-${p.id}`}>
                  <span className="status-pill status-pill--sold-out">Sold out</span>
                  <span>{p.name}</span>
                </li>
              ))}
              {neverSold.slice(0, 4).map((p) => (
                <li key={`unsold-${p.id}`}>
                  <span className="status-pill status-pill--pending">No sales</span>
                  <span>{p.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-header">
          <h3>Recent orders</h3>
          <Link to="/admin/order" className="text-button">View all &rarr;</Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="primary-text">No orders yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Placed</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.orderId}>
                  <td>#{o.orderId}</td>
                  <td>{o.customerDetails?.name || "—"}</td>
                  <td>{GetDate(o.orderDateAndTime)}</td>
                  <td>&#8377;{o.totalAmount}</td>
                  <td><span className="status-pill status-pill--pending">{o.orderStatus}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="admin-panel">
        <h3>Top sellers</h3>
        {topSellers.length === 0 ? (
          <p className="primary-text">No sales recorded yet.</p>
        ) : (
          <ul className="admin-top-sellers">
            {topSellers.map(([name, qty]) => (
              <li key={name}>
                <span>{name}</span>
                <span className="admin-top-sellers-count">{qty}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
