import React, { useEffect, useState, useMemo } from 'react'
import ProductTable from './ProductPageComponents/ProductTable'
import ProductForm from './ProductPageComponents/ProductForm'
import Modal from './ProductPageComponents/Modal'
import SearchBar from './ProductPageComponents/ProductSearchBar'
import { addProduct, adminProductList, updateProduct, deleteProduct, changeStatus } from '../../Services/product_service';
import {fetchCategories} from '../../Services/category_service';
import { Button } from '@mui/material'

function Product () {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');


  const fetchProducts = async () => {
    const response = await adminProductList();
    setProducts(response);
  };

  const getCategories = async () => {
    const response = await fetchCategories();
    setCategories(response);
  };

  // Was wired to a handler that was never passed in, so typing did nothing.
  // Filters client side against the list already fetched -- there is no
  // dedicated search endpoint for the admin product list.
  const visibleProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !categoryFilter || String(p.categoryId) === String(categoryFilter);
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const handleAdd = async (product) => {
    if (selectedProduct) await updateProduct(product);
    else await addProduct(product);
    fetchProducts();
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    fetchProducts();
  };

  const handleStatusToggle = async (id, status) => {
    let obj = {"id": id, "status":status};
    await changeStatus(obj)
    console.log(obj.status)
    fetchProducts()
  };

  const handleAddProductClick = () => {
    setSelectedProduct(null); 
    setModalOpen(true);
  };

  useEffect(() => {
    fetchProducts();
    getCategories();
  }, []);

  return (
    <div className="admin-page-content">
      <div className="admin-page-header">
        <div>
          <h1>Products</h1>
          <p className="primary-text">
            {products.length} total &middot; {products.filter((p) => p.status !== 'true').length} unavailable
          </p>
        </div>
        <Button variant="contained" color="primary" onClick={handleAddProductClick}>
          Add product
        </Button>
      </div>

      <div className="top_div">
        <SearchBar value={search} onSearch={setSearch} />
        <select
          className="filter-chip"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <ProductTable products={visibleProducts} onEdit={handleEdit} onDelete={handleDelete} onStatusToggle={handleStatusToggle}/>
      <Modal open={isModalOpen} onClose={() => setModalOpen(false)}>
        <ProductForm onSave={handleAdd} selectedProduct={selectedProduct} categories={categories} />
      </Modal>
    </div>
  )
}

export default Product