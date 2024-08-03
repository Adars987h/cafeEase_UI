
import "../CSS/DashboardPage.css";
import React from 'react';
import Navbar from '../Components/DashboardPageComponents/Navbar';
import Home from '../Components/DashboardPageComponents/Home';
import Products from '../Components/DashboardPageComponents/Products';
import Orders from '../Components/DashboardPageComponents/Orders';
import Footer from '../Components/DashboardPageComponents/Footer';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductsDashBoard = () => {
  return (
    <div className="App" >
      <ToastContainer/>
      <Navbar />
      <Home />
      <Products />
      <Orders />
      <Footer />
    </div>
  );
};

export default ProductsDashBoard;
