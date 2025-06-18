// Landingsida genereras av alla componenter
const { createHero } = require('../components/hero');

/**
 * generera hela landingsida main content
 * @returns {string} Homepage HTML content
 */
function generateHomepage() {
    // Hero section
    const heroSection = createHero();

    // Produkter section
    const productSection = `
        <div class="products-wrapper" id="products-container">
            <div class="loading-message">Laddar produkter...</div>
        </div>
    `;

    // Kombinerar Allt!
    return `
        ${heroSection}
        ${productSection}
    `; 
}

module.exports = { generateHomepage };