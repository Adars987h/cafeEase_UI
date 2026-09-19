import React, { useEffect, useState } from "react";
import { getAllUsers, updateUserStatus } from "../../Services/user_service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Switch from "@mui/material/Switch";

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    getAllUsers()
      .then((data) => { setUsers(data || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(load, []);

  const toggleStatus = async (user) => {
    setBusyId(user.id);
    const next = user.status === "true" ? "false" : "true";
    try {
      await updateUserStatus(user.id, next);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: next } : u)));
      toast.success(next === "true" ? "Customer enabled" : "Customer disabled", {
        position: "bottom-left",
        autoClose: 1500,
        theme: "dark",
      });
    } catch {
      toast.error("Could not update this customer", { position: "bottom-left", theme: "dark" });
    } finally {
      setBusyId(null);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page-content">
      <div className="admin-page-header">
        <div>
          <h1>Customers</h1>
          <p className="primary-text">
            {users.length} total &middot; {users.filter((u) => u.status !== "true").length} disabled
          </p>
        </div>
        <input
          type="search"
          className="dashboard-search-input"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: 240, borderRadius: 12 }} />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">?</div>
          <p className="empty-state__title">No customers match &quot;{search}&quot;</p>
        </div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="admin-table-name-cell">
                    <span className="cart-item-tile" style={{ width: 32, height: 32, fontSize: 12 }}>
                      {user.name.slice(0, 2).toUpperCase()}
                    </span>
                    {user.name}
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{user.contactNumber}</td>
                <td>
                  <div className="admin-table-actions" style={{ alignItems: "center" }}>
                    <Switch
                      checked={user.status === "true"}
                      onChange={() => toggleStatus(user)}
                      disabled={busyId === user.id}
                      inputProps={{ "aria-label": `Enabled: ${user.name}` }}
                    />
                    <span className={`status-pill ${user.status === "true" ? "status-pill--active" : "status-pill--disabled"}`}>
                      {user.status === "true" ? "Active" : "Disabled"}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default User;
