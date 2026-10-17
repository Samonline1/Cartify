// Catalog service: external API with Redis Cache-Aside
const axios = require("axios");
const { catalogBaseUrl } = require("../config/catalog");
const { getOrSet } = require("./cacheService");

// TTL settings
const PRODUCT_TTL = 24 * 60 * 60; // 24 hours
const SEARCH_TTL = 60 * 60;       // 1 hour
const CATEGORY_TTL = 60 * 60;     // 1 hour
const ALL_PRODUCTS_TTL = 60 * 60; // 1 hour

// URL builder
function buildUrl(path = "") {
  return `${catalogBaseUrl}${path}`;
}

// Search products (1h TTL)
async function searchProducts(query) {
  const normalizedQuery = (query || "").toLowerCase().trim();
  const cacheKey = `catalog:search:${normalizedQuery}`;

  return getOrSet(cacheKey, SEARCH_TTL, async () => {
    const response = await axios.get(buildUrl(`/search?q=${encodeURIComponent(query)}`));
    return response.data.products || [];
  });
}

// Category products (1h TTL)
async function getProductsByCategory(category) {
  const normalizedCategory = (category || "").toLowerCase().trim();
  const cacheKey = `catalog:category:${normalizedCategory}`;

  return getOrSet(cacheKey, CATEGORY_TTL, async () => {
    const response = await axios.get(buildUrl(`/category/${encodeURIComponent(category)}`));
    return response.data.products || [];
  });
}

// Single product (24h TTL - fixes N+1)
async function getProductById(id) {
  const cacheKey = `catalog:product:${id}`;

  return getOrSet(cacheKey, PRODUCT_TTL, async () => {
    const response = await axios.get(buildUrl(`/${encodeURIComponent(id)}`));
    return response.data;
  });
}

// All products (1h TTL)
async function getAllProducts(limit = 0) {
  const cacheKey = `catalog:all:${limit}`;

  return getOrSet(cacheKey, ALL_PRODUCTS_TTL, async () => {
    const response = await axios.get(buildUrl(`?limit=${limit}`));
    return response.data.products || [];
  });
}

module.exports = {
  searchProducts,
  getProductsByCategory,
  getProductById,
  getAllProducts,
};
