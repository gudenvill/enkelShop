const fs = require('fs');
const path = require('path');

/**
 * @returns {Array} med alla produktersdata
 */
function loadProducts() {
    try {
        const productsPath = path.join(__dirname, '../data/products.json');
        const productsData = fs.readFileSync(productsPath, 'utf8');
        const products = JSON.parse(productsData);

        // Sortera produkter med nyaste först
        return products.sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
        });
    } catch (error) {
        console.error('Fel vid laddning av produkter:', error);
        return [];
    }
}

/**
 * @param {number} id
 * @returns {Object|null} Produktdata eller null om inte finns
 */
function getProductById(id) {
    const products = loadProducts();
    return products.find(product => product.id === parseInt(id)) || null;
}

module.exports = {
    loadProducts,
    getProductById
};