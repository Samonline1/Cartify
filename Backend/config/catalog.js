const catalogBaseUrl = process.env.CATALOG_BASE_URL || "";

if (!catalogBaseUrl) {
  throw new Error("CATALOG_BASE_URL is not configured");
}

module.exports = { catalogBaseUrl };
