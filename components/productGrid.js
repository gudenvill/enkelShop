const { createProductCard } = require('./productCard');

/**
 * @param {Array} products - Array med produktdata
 * @returns {string} HTML för produktgrid
 */
function createProductGrid(products) {
    // Fallet när inga produkter finns
    if (!products || products.length === 0) {
        return `
            <div class="products-wrapper">
                <p>Inga produkter hittades.</p>
            </div>
        `; 
    }

    // Generera produktkort för alla produkter
    const productCards = products
        .filter(product => product.is_active) // OBS! VISAR BARA AKTIVA PRODUKTER
        .map(product => createProductCard(product))
        .join('');

        return `
        <div class="products-wrapper">
            <div class="products-grid">
                ${productCards}
            </div>
        </div>
    `; 
}

module.exports = { createProductGrid };