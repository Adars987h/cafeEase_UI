import React, { useEffect, useState } from 'react';
import { getAllOrdersForUser, getAllOrdersForUserWithSearchRequest } from '../../Services/order_service';
import BannerBackground from "../../Assets/home-banner-background.png";
import NoOrdersImg from "../../Assets/no_orders.png";
import CalendarIcon from "../../Assets/calendar-icon.png";
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const [showDateRange, setShowDateRange] = useState(false);


  const searchOrders = async () => {
    const searchText = document.getElementById('search').value;
    console.log(searchText);
    const orders = await getAllOrdersForUserWithSearchRequest(searchText);
    setOrders(orders)
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      searchOrders();
    }
  };

  useEffect(() => {
    const getOrders = async () => {
      try {
        const orders = await getAllOrdersForUser();
        console.log("Cart fetched successfully")
        setOrders(orders);
        setLoading(false);

      } catch (error) {
        setError(error);
        setLoading(false);
        console.log("Error while fetching cart");
      }
    };

    getOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (

    <div className='cart-container'>

      <div className="home-bannerImage-container bg-container">
        <img src={BannerBackground} alt="" className='backgoround-img' />
      </div>

      <div className='inner-cart-container'>
        {
          AreOrdersPresent(orders) ? (
            <>
              <div className="orders-img" style={{
                backgroundImage: `url(${NoOrdersImg})`,
                backgroundSize: 'fixed',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                height: '800px',
                width: '40vw',
              }}>
              </div>
            </>
          ) : (
            <>
              <div>
                <div class="search-container">
                  <input type="text" id="search" placeholder="Search orders..." onKeyDown={handleKeyDown} />
                  <button className='calendar-icon-container' onClick={() => setShowDateRange(!showDateRange)}><img src={CalendarIcon} className='calendar-icon'></img></button>
                  {showDateRange && (
                    <DateRange
                      editableDateInputs={true}
                      onChange={item => setDateRange([item.selection])}
                      moveRangeOnFirstSelection={false}
                      ranges={dateRange}
                      className="date-range-picker"
                    />
                  )}
                  <button className='card-tag subtle search-btn' onClick={(searchOrders)}>Search</button>
                </div>
                {orders.map(order => (
                  <Order key={order.orderId} order={order} />
                ))}
              </div>

            </>
          )
        }
      </div>
    </div>
  );
};

const AreOrdersPresent = (orders) => {
  return orders == null || orders.length === 0;
}

const Order = ({ order }) => {

  return (
    <div className='Cart-Card'>
      <div className='left-side'>
        <h3 className='ProductName'>{order.orderId}</h3>
        <div className='PricePerUnit'>Order Date - <p className='ProductPrice'>{GetDate(order.orderDateAndTime)}</p></div>
        <div className='OverallPrice'>Order Status - <p className='ProductPrice'>{order.orderStatus}</p></div>
        <div className='PricePerUnit'>Total Quantity - <p className='ProductPrice'>{order.totalQuantity}</p></div>
        <div className='OverallPrice'>Total Amount - <p className='ProductPrice overall'> INR  {order.totalAmount}</p></div>
      </div>
      <div className='addCartOptions right-side'>

        <button className='card-tag subtle view-order-btn' >View Order Detail</button>
        <button className='card-tag subtle' >Download bill</button>
      </div>
    </div>
  );
};

const GetDate = (dateTime) => {
  const dateObject = new Date(dateTime);

  const year = dateObject.getFullYear();
  const month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
  const day = ("0" + dateObject.getDate()).slice(-2);

  const date = `${year}-${month}-${day}`;
  // console.log(date);
  return date;

}

export default Orders;
