import { myAxios } from "./helper";

export const productList = async () => {
    try {
        const response = await myAxios.get("/product");
        const data = response.data.data;  // Accessing the array of products
        return data;
    } catch (error) {
        console.error('Error fetching product list:', error);
        throw error;
    }
};

export const productListByCategory = async (categoryId) => {
    try {
        const response = await myAxios.get("/product/getByCategory/"+categoryId);
        const data = response.data.data;  // Accessing the array of products
        return data;
    } catch (error) {
        console.error('Error fetching product list:', error);
        throw error;
    }
};
