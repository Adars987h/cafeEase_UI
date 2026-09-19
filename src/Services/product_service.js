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

// multipart/form-data so a dish photo can ride along with the text fields --
// matches how the category endpoints already accept an image.
const toProductForm = (product) => {
    const form = new FormData();
    form.append('name', product.name);
    form.append('categoryId', product.categoryId);
    form.append('description', product.description);
    form.append('price', product.price);
    if (product.imageFile) {
        form.append('image', product.imageFile);
    }
    return form;
};

export const addProduct = async (product) => {
    try {
        const response = await myAxios.post("/product/add", toProductForm(product));
        const data = response.data;
        return data;
    } catch (error) {
        console.error('Error Adding product:', error);
        throw error;
    }
};

export const updateProduct = async (product) => {
    try {
        const form = toProductForm(product);
        form.append('id', product.id);
        const response = await myAxios.post("/product/update", form);
        const data = response.data;
        return data;
    } catch (error) {
        console.error('Error Updating product list:', error);
        throw error;
    }
};

export const deleteProduct = async (id) => {
    try {
        const response = await myAxios.post("/product/delete/"+id);
        const data = response.message;
        return data;
    } catch (error) {
        console.error('Error Updating product list:', error);
        throw error;
    }
};

export const adminProductList = async () => {
    try {
        const response = await myAxios.get("/product/admin");
        const data = response.data.data;  // Accessing the array of products
        return data;
    } catch (error) {
        console.error('Error fetching product list:', error);
        throw error;
    }
};

export const changeStatus = async (product) => {
    try {
        const response = await myAxios.post("/product/updateStatus", product);
        const data = response.message;
        return data;
    } catch (error) {
        console.error('Error fetching product list:', error);
        throw error;
    }
};

