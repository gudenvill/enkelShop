const { createProductDetail } = require('../components/productDetail');
const { getProductById } = require('../services/productService');

/**
 * Generera produktdetaljside
 * @param {number} productId
 * @returns {Object} Objekt med content och title eller error
 */
function generateProductDetailPage(productId) {
    // Hämta produktdata
    const product = getProductById(productId);

    // Om produkt inte finns
    if (!product) {
        return {
            error: true,
            statusCode: 404,
            content: create404ProductPage(productId),
            title: 'Produkten hittades inte | EnkelShop'
        };
    }

    // Om produkt är ej aktiv
    if (!product.is_active) {
        return {
            error: true,
            statusCode: 404,
            content: createInactiveProductPage(),
            title: 'Produkten är inte tillgänglig | EnkelShop'
        };
    }

    const content = createProductDetail(product);

    return {
        error: false,
        content: content,
        title: `${product.name} - ${product.brand} | EnkelShop`
    }
}

/**
 * Skapa 404-sida för produkt som inte finns
 * @param {number} productId - ID som inte hittades
 * @returns {string} HTML för 404-sida
 */
function create404ProductPage(productId) {
    return `
        <div class="error-page">
            <div class="error-content">
                <h1>404 - Produkten hittades inte</h1>
                <p>Produkten med ID <strong>${productId}</strong> kunde inte hittas.</p>
                <p>Produkten kan ha tagits bort eller så har du angett fel URL.</p>
                
                <div class="error-actions">
                    <a href="/">Tillbaka till startsidan</a>
                    <a href="/api/products">Se alla produkter (JSON)</a>
                </div>
            </div>
        </div>
    `;
}

/**
 * Skapa sida för inaktiv produkt
 * @returns {string} HTML för inaktiv produktsida
 */
function createInactiveProductPage() {
    return `
        <div class="error-page">
            <div class="error-content">
                <h1>Produkten är inte tillgänglig</h1>
                <p>Denna produkt är för närvarande inte tillgänglig för köp.</p>
                
                <div class="error-actions">
                    <a href="/">Se andra produkter</a>
                </div>
            </div>
        </div>
    `;
}

module.exports = { 
    generateProductDetailPage,
    create404ProductPage,
    createInactiveProductPage
};