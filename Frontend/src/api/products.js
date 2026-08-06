import API from "../api";

export async function fetchProductByID(id) {
    const response = await API.get(`/products/${id}`);
    return response.data;
}

export async function fetchProductByName(name) {
    const response = await API.get(`/products/search?q=${name}`);
    return response.data;
}
