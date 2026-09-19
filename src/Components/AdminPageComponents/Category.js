import React, { useEffect, useState } from "react";
import { fetchCategories, addCategory, updateCategory, deleteCategory } from "../../Services/category_service";
import { productList } from "../../Services/product_service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [itemCounts, setItemCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const [categoryData, products] = await Promise.all([
      fetchCategories(),
      productList().catch(() => []),
    ]);
    const counts = {};
    (products || []).forEach((p) => { counts[p.categoryId] = (counts[p.categoryId] || 0) + 1; });
    setCategories(categoryData || []);
    setItemCounts(counts);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setBusy(true);
    try {
      await addCategory(newName.trim());
      setNewName("");
      toast.success("Category added", { position: "bottom-left", autoClose: 1500, theme: "dark" });
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not add category", { position: "bottom-left", theme: "dark" });
    } finally {
      setBusy(false);
    }
  };

  const startRename = (category) => {
    setEditingId(category.id);
    setEditValue(category.name);
  };

  const saveRename = async (id) => {
    if (!editValue.trim()) return;
    setBusy(true);
    try {
      await updateCategory(id, editValue.trim());
      setEditingId(null);
      toast.success("Category renamed", { position: "bottom-left", autoClose: 1500, theme: "dark" });
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not rename category", { position: "bottom-left", theme: "dark" });
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (category) => {
    if (!window.confirm(`Delete "${category.name}"? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await deleteCategory(category.id);
      toast.success("Category deleted", { position: "bottom-left", autoClose: 1500, theme: "dark" });
      load();
    } catch (err) {
      // The backend rejects deletion while products still reference the
      // category -- surface that reason instead of a generic failure.
      toast.error(err?.response?.data?.message || "Could not delete category", { position: "bottom-left", theme: "dark" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-page-content">
      <div className="admin-page-header">
        <div>
          <h1>Categories</h1>
          <p className="primary-text">{categories.length} total</p>
        </div>
      </div>

      <form className="admin-inline-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="New category name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="dashboard-search-input"
        />
        <button className="primary-button" type="submit" disabled={busy} style={{ minHeight: 44 }}>Add category</button>
      </form>

      {loading ? (
        <div className="skeleton" style={{ height: 240, borderRadius: 12 }} />
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Items</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>
                  {editingId === category.id ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="admin-inline-edit-input"
                      autoFocus
                    />
                  ) : (
                    category.name
                  )}
                </td>
                <td>{itemCounts[category.id] || 0}</td>
                <td className="admin-table-actions">
                  {editingId === category.id ? (
                    <>
                      <button className="text-button" onClick={() => saveRename(category.id)} disabled={busy}>Save</button>
                      <button className="text-button" onClick={() => setEditingId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="text-button" onClick={() => startRename(category)}>Rename</button>
                      <button className="text-button" onClick={() => handleDelete(category)} disabled={busy}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Category;
