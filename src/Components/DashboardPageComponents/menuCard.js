// MenuCard.js
import React, { useState, useEffect } from 'react';
import "../../CSS/DashboardPage.css";
import { handleAddToCart } from "../../Services/cart_service"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const MenuCard = ({ product, cartItemsIdToQuantityMap }) => {
  const [quantity, setQuantity] = useState(1);

  const addToast = () => {
    toast.success("Item added to cart.....", {
      theme: "dark"
    })
  };

  useEffect(() => {
    const productQuantity = cartItemsIdToQuantityMap.get(product.id);
    setQuantity(productQuantity !== undefined ? productQuantity : 1);
  }, [cartItemsIdToQuantityMap, product.id]);

  // const handleQuantityChange = (e) => {
  //   setQuantity(e.target.value);
  // };
  return (
    <div className='Card'>
      <h3 className='ProductName'>{product.name}</h3>
      <p className='ProductDescription'>{product.description}</p>
      <div className='ProductPrice'>INR {product.price}</div>
      <div className='CategoryName'>{product.categoryName}</div>
      <div className='addCartOptions'>
        <input type="number" id="quantity" className='ProductQuantity' name="quantity" placeholder='Quantity' min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        <button className='card-tag subtle' onClick={() => { handleAddToCart(product.id, quantity); addToast(); }}>Add to Cart</button>
      </div>
    </div>
  );
};

export default MenuCard;
