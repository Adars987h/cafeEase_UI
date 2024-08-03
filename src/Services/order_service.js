import { myAxios } from "./helper";

export const placeOrderFromCart = async() => {

    try {
      const response = await myAxios.post("/orders");
      const data = response.data;  // Accessing the array of products
      return data;
  } catch (error) {
      console.error('Error placing order :', error);
      throw error;
  }
};