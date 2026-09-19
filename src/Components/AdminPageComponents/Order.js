import React, { useEffect, useState } from "react";
import { getAllOrdersForUser, getAllOrdersForUserWithSearchRequest } from "../../Services/order_service";
import { viewBill } from "../../Services/bill_service";
import BillModal from "../DashboardPageComponents/BillModal";
import OrderDetailsModal from "../DashboardPageComponents/OrderDetailsModal";
import { GetDate } from "../DashboardPageComponents/Orders";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pdfBlob, setPdfBlob] = useState(null);
  const [detailOrder, setDetailOrder] = useState(null);

  const load = () => {
    setLoading(true);
    getAllOrdersForUser()
      .then((data) => { setOrders(data || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSearch = async (value) => {
    setSearch(value);
    try {
      const data = await getAllOrdersForUserWithSearchRequest(value, null, null);
      setOrders(data || []);
    } catch {
      setOrders([]);
    }
  };

  const handleViewBill = async (orderId) => {
    try {
      const blob = await viewBill(orderId);
      setPdfBlob(blob);
    } catch (error) {
      console.error("Error fetching bill", error);
    }
  };

  return (
    <div className="admin-page-content">
      <div className="admin-page-header">
        <div>
          <h1>Orders</h1>
          <p className="primary-text">{orders.length} order{orders.length === 1 ? "" : "s"}</p>
        </div>
        <input
          type="text"
          className="dashboard-search-input"
          placeholder="Search order ID or customer"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: 240, borderRadius: 12 }} />
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">&#128203;</div>
          <p className="empty-state__title">No orders found</p>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Placed</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderId}>
                <td>#{order.orderId}</td>
                <td>{order.customerDetails?.name || "—"}</td>
                <td>{GetDate(order.orderDateAndTime)}</td>
                <td>{order.totalQuantity}</td>
                <td>&#8377;{order.totalAmount}</td>
                <td><span className="status-pill status-pill--pending">{order.orderStatus}</span></td>
                <td className="admin-table-actions">
                  <button className="text-button" onClick={() => setDetailOrder(order)}>View</button>
                  <button className="text-button" onClick={() => handleViewBill(order.orderId)}>Bill</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {pdfBlob && <BillModal pdfBlob={pdfBlob} onClose={() => setPdfBlob(null)} />}
      {detailOrder && <OrderDetailsModal order={detailOrder} onClose={() => setDetailOrder(null)} />}
    </div>
  );
};

export default Order;
