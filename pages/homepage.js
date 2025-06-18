// Landingsida genereras av alla componenter
const { createHero } = require('../components/hero');
const { createProductGrid } = require('../components/productGrid');
const { loadProducts } = require('../services/productService');

/**
 * generera hela landingsida main content
 * @returns {string} Homepage HTML content
 */
function generateHomepage() {
    // Hero section
    const heroSection = createHero();

    // Ladda Produkter från JSON
    const products = loadProducts();

    // Produkter section
    const productSection = createProductGrid(products)

    // Kombinerar Allt!
    return `
        ${heroSection}
        ${productSection}
    `; 
}

module.exports = { generateHomepage };