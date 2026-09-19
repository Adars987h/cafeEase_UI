import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Product from '../Components/AdminPageComponents/Product';
import Category from '../Components/AdminPageComponents/Category';
import User from '../Components/AdminPageComponents/User';
import Order from '../Components/AdminPageComponents/Order';
import Bill from '../Components/AdminPageComponents/Bill';
import Home from '../Components/AdminPageComponents/Home';
import NotFound from './NotFound';
import Navbar from '../Components/AdminPageComponents/Navbar'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../CSS/AdminPage.css";



const AdminPage = () => {

  return (
    <>
      {/* Outside .admin-shell on purpose: react-toastify positions itself
          fixed regardless, but as a sibling of Navbar/main it was still
          counted as a grid item first, which pushed both into unpredictable
          auto-placed rows/columns. */}
      <ToastContainer/>
      <div className='admin-shell'>
        <Navbar />
        <main className="admin-main">
          <Routes>
            <Route path="/products" element={<Product />} />
            <Route path="/category" element={<Category />} />
            <Route path="/user" element={<User />} />
            <Route path="/order" element={<Order />} />
            <Route path="/bill" element={<Bill />} />
            <Route path="/" element={<Home/>} />
            <Route path="/*" element={<NotFound />} />

          </Routes>
        </main>
      </div>
    </>
  );
};

export default AdminPage;
