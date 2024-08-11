import { myAxios } from "./helper";

export const fetchCategories = async () => {
    try {
        const response = await myAxios.get("/category");
        const data = response.data.data;  // Accessing the array of categories
        return data;
    } catch (error) {
        console.error('Error fetching product list:', error);
        throw error;
    }
};
