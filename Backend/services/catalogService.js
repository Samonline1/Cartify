const axios = require("axios");
const { catalogBaseUrl } = require("../config/catalog");

function buildUrl(path = "") {
  return `${catalogBaseUrl}${path}`;
}

async function searchProducts(query) {
  const response = await axios.get(buildUrl(`/search?q=${encodeURIComponent(query)}`));
  return response.data.products || [];
}

async function getProductsByCategory(category) {
  const response = await axios.get(buildUrl(`/category/${encodeURIComponent(category)}`));
  return response.data.products || [];
}

async function getProductById(id) {
  const response = await axios.get(buildUrl(`/${encodeURIComponent(id)}`));
  return response.data;
}

async function getAllProducts(limit = 0) {
  const response = await axios.get(buildUrl(`?limit=${limit}`));
  return response.data.products || [];
}

module.exports = {
  searchProducts,
  getProductsByCategory,
  getProductById,
  getAllProducts,
};
