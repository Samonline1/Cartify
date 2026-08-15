

export function parseQuery(query) {
    const text = query.toLowerCase().trim();

    const result = {
        category: null,
        minPrice: null,
        maxPrice: null,
        minRating: null,
        features: [],
        sortBy: null,
    };

    // Category
    if (
        text.includes("phone") ||
        text.includes("smartphone") ||
        text.includes("mobile")
    ) {
        result.category = "smartphones";
    }

    if (text.includes("laptop")) {
        result.category = "laptops";
    }

    if (text.includes("shoes")) {
        result.category = "shoes";
    }

    // Maximum price
    const maxPrice = text.match(
        /(?:under|below|less than|upto|up to)\s*₹?\s*(\d+)/i
    );

    if (maxPrice) {
        result.maxPrice = Number(maxPrice[1]);
    }

    // Minimum price
    const minPrice = text.match(
        /(?:above|over|more than)\s*₹?\s*(\d+)/i
    );

    if (minPrice) {
        result.minPrice = Number(minPrice[1]);
    }

    // Rating
    let rating = null;

    rating =
        text.match(
            /(?:rating|rated|stars?)\s*(?:of|above|over|at\s*least|minimum)?\s*(\d(?:\.\d)?)/i
        ) ||
        text.match(
            /(?:above|over|at\s*least|minimum)\s*(\d(?:\.\d)?)\s*(?:rating|rated|stars?)/i
        );

    if (rating) {
        result.minRating = Number(rating[1]);
    }

    // Features
    if (text.includes("gaming")) {
        result.features.push("gaming");
    }

    if (text.includes("5g")) {
        result.features.push("5g");
    }

    if (text.includes("camera")) {
        result.features.push("camera");
    }

    // Sorting
    if (
        text.includes("cheapest") ||
        text.includes("lowest price") ||
        text.includes("low price")
    ) {
        result.sortBy = "price_asc";
    }

    if (
        text.includes("expensive") ||
        text.includes("highest price")
    ) {
        result.sortBy = "price_desc";
    }

    if (
        text.includes("best rated") ||
        text.includes("highest rated")
    ) {
        result.sortBy = "rating_desc";
    }

    return result;
}

