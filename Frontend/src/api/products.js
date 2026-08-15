import API from "../api";

export async function fetchProductByID(id) {
    const response = await API.get(`/products/${id}`);
    return response.data;
}

export async function fetchProductByName(name) {
    const response = await API.get(`/products/search?q=${name}`);
    return response.data;
}

export async function searchWithAssistant(query) {
    const response = await API.get(`/products/asksearch`, {
        params: { q: query}
    });
    return response.data;
}

export async function fetchHomeProducts() {
    const response = await fetch("https://dummyjson.com/products?limit=100");

    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }

    const data = await response.json();

    return Array.isArray(data.products) ? data.products : [];
}

export async function fetchProductSearch(name) {
    const response = await API.get(`/products/search?q=${name}`);
    return Array.isArray(response.data) ? response.data : response.data?.products ?? [];
}

export async function fetchProductsByCategory(name) {
    const response = await API.get(`/products/category/${name}`);
    return Array.isArray(response.data) ? response.data : response.data?.products ?? [];
}

export async function fetchCartItems() {
    const response = await API.get("/products/cart/all");
    return Array.isArray(response.data) ? response.data : [];
}

export async function fetchCartTotal() {
    const response = await API.get("/products/cart/total");
    return response.data?.total ?? 0;
}

export async function fetchCheckoutItems() {
    const response = await API.get("/products/checkout/all");
    const purchases = Array.isArray(response.data) ? response.data : [];

    return Promise.all(
        purchases.map(async (item) => {
            try {
                const productId = item.product || item.id;
                if (!productId) return item;

                const product = await fetchProductByID(productId);

                return {
                    ...item,
                    title: item.title || product.title,
                    thumbnail: item.thumbnail || product.thumbnail,
                    images: item.images || product.images,
                };
            } catch {
                return item;
            }
        })
    );
}

export async function fetchCheckoutTotal() {
    const response = await API.get("/products/checkout/total");
    return response.data?.total ?? 0;
}

export async function fetchProfileCheckoutTotal() {
    return fetchCheckoutTotal();
}

export async function postCartCheckout() {
    const response = await API.post("/products/checkout");
    return response.data;
}

export async function deleteCartItem(id) {
    const response = await API.delete(`/products/cart/${id}`);
    return response.data;
}
