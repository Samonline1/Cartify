import API from "../api";

export async function fetchProduct(id) {
    const response = await API.get(`/products/${id}`);
    return response.data;
}
