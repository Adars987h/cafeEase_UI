import React, { useState, useEffect } from 'react';
import { productList, productListByCategory } from '../../Services/product_service';
import { fetchCart } from '../../Services/cart_service';
import MenuCard from './menuCard';
import BannerBackground from "../../Assets/home-banner-background.png";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from './Spinner';
import { useParams } from 'react-router-dom';

const Products = () => {
  const { id: categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartItemsIdToQuantityMap, setCartItemsIdToQuantityMap] = useState(new Map());

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let productsData;
        if(categoryId == null){
          productsData = await productList();
        } else{
          productsData = await productListByCategory(categoryId);
        }
        console.log("Products fetched successfully")
        await setIdToQuantityMapFromCart(setCartItemsIdToQuantityMap);
        setProducts(productsData);
        setLoading(false);

      } catch (error) {
        toast.error("Error fetching products");
        setLoading(false);
        console.log("Error while fetching products");
      }
    };

    fetchProducts();
  }, [categoryId]);

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
        <MenuCard key={product.id} product={product} cartItemsIdToQuantityMap={cartItemsIdToQuantityMap}/>
      ))}
    </div>
  );
};

export default Products;

async function setIdToQuantityMapFromCart(setCartItemsIdToQuantityMap) {
  const cart = await fetchCart();
  const map = new Map();
  if (cart !== null) {
    cart.items.forEach((item) => {
      map.set(item.productId, item.quantity);
    });
    setCartItemsIdToQuantityMap(map);
  }
}

