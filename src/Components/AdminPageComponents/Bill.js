import React, { useEffect, useState } from "react";
import { getAllOrdersForUser } from "../../Services/order_service";
import { viewBill } from "../../Services/bill_service";
import BillModal from "../DashboardPageComponents/BillModal";
import { GetDate } from "../DashboardPageComponents/Orders";

/**
 * There is no separate "Bill" record to list -- invoices are PDFs generated
 * on demand from an order (see BillServiceImpl: getPdfName(orderId) reads
 * "Invoice-{orderId}.pdf" off disk). So this screen is the order list,
 * scoped to what a bill search actually needs: who, when, how much, view.
 */
const Bill = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pdfBlob, setPdfBlob] = useState(null);

  useEffect(() => {
    getAllOrdersForUser()
      .then((data) => { setOrders(data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleViewBill = async (orderId) => {
    try {
      const blob = await viewBill(orderId);
      setPdfBlob(blob);
    } catch (error) {
      console.error("Error fetching bill", error);
    }
  };

  const filtered = orders.filter((o) => String(o.orderId).includes(search.trim()));

  return (
    <div className="admin-page-content">
      <div className="admin-page-header">
        <div>
          <h1>Bills</h1>
          <p className="primary-text">{orders.length} invoice{orders.length === 1 ? "" : "s"}</p>
        </div>
        <input
          type="text"
          className="dashboard-search-input"
          placeholder="Search invoice no."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: 240, borderRadius: 12 }} />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">&#128196;</div>
          <p className="empty-state__title">No invoices found</p>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.orderId}>
                <td>INV-{order.orderId}</td>
                <td>{order.customerDetails?.name || "—"}</td>
                <td>{GetDate(order.orderDateAndTime)}</td>
                <td>&#8377;{order.totalAmount}</td>
                <td className="admin-table-actions">
                  <button className="text-button" onClick={() => handleViewBill(order.orderId)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {pdfBlob && <BillModal pdfBlob={pdfBlob} onClose={() => setPdfBlob(null)} />}
    </div>
  );
};

export default Bill;
