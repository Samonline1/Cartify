const {
    searchProducts,
    getProductsByCategory,
    getProductById,
} = require("../services/catalogService");


const searchProductsService = async (parsedQuery) => {
    const filters = parsedQuery;

    let products;

    // Get initial dataset
    if (filters.category) {
        products = await getProductsByCategory(filters.category);
    } else {
        products = await searchProducts(filters);
    }



    // Price
    if (filters.minPrice !== null) {
        products = products.filter(
            (product) => product.price >= filters.minPrice
        );
    }



    if (filters.maxPrice !== null) {
        products = products.filter(
            (product) => product.price <= filters.maxPrice
        );
    }



    // Rating
    if (filters.minRating !== null) {
        products = products.filter(
            (product) => product.rating >= filters.minRating
        );
    }



    // Features
    if (filters.features?.length > 0) {
        const featureFilteredProducts = products.filter((product) => {
            const searchableText = [
                product.title,
                product.description,
                product.brand,
                ...(product.tags || []),
            ]
                .join(" ")
                .toLowerCase();

            return filters.features.some((feature) =>
                searchableText.includes(feature.toLowerCase())
            );
        });

        // Only apply feature filtering if it found something
        if (featureFilteredProducts.length > 0) {
            products = featureFilteredProducts;
        }
    }


    // Sorting
    if (filters.sortBy === "price_asc") {
        products.sort((a, b) => a.price - b.price);
    }

    if (filters.sortBy === "price_desc") {
        products.sort((a, b) => b.price - a.price);
    }

    if (filters.sortBy === "rating") {
        products.sort((a, b) => b.rating - a.rating);
    }


    return products;
};


module.exports = {
    searchProductsService,
};