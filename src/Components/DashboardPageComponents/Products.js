import React, { useState, useEffect } from 'react';
import { productList } from '../../Services/product_service';
import MenuCard from './menuCard';
import BannerBackground from "../../Assets/home-banner-background.png";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from './Spinner';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await productList();
        console.log("Products fetched successfully")
        setProducts(productsData);
        setLoading(false);

      } catch (error) {
        toast.error("Error fetching products");
        setLoading(false);
        console.log("Error while fetching products");
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div><Spinner/></div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (

    <div className='product-container'>
      
      <div className="home-bannerImage-container">
        <img src={BannerBackground} alt="" />
      </div>
      {products.map(product => (
        <MenuCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default Products;
