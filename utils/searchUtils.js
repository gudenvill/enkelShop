const { loadProducts } = require('../services/productService');
const { createProductGrid } = require('../components/productGrid');

/**
 * Generera sökresultat innehåll
 * @param {string} query - Sökfråga
 * @returns {string} HTML för sökresultat
 */

function generateSearchResults(query) {
    const allProducts = loadProducts();

    // Filtrera produkter som matchar sökningen
    const searchResults = allProducts.filter(product =>
        product.is_active &&
        product.name.toLowerCase().includes(query.toLowerCase())
    );

    // Sökresultat info sektion
    const searchInfo = `
        <div class="search-info">
            <h2>Sökresultat för: "${query}"</h2>
            <p>Hittade ${searchResults.length} produkter</p>
            <a href="/">Visa alla produkter</a>
        </div>
    `;

    const productGrid = createProductGrid(searchResults);

    return searchInfo + productGrid;
}

module.exports = { generateSearchResults };