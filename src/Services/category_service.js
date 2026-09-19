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

// Add/update take multipart/form-data because the backend accepts an
// optional image file alongside the name.
export const addCategory = async (name) => {
    const form = new FormData();
    form.append('name', name);
    const response = await myAxios.post('/category', form);
    return response.data;
};

export const updateCategory = async (id, name) => {
    const form = new FormData();
    form.append('name', name);
    const response = await myAxios.put(`/category/${id}`, form);
    return response.data;
};

export const deleteCategory = async (id) => {
    const response = await myAxios.delete(`/category/${id}`);
    return response.data;
};
