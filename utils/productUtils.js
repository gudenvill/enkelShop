/**
 * Kontrollera om en produkt är ny (mindre än 7 dagar gammal)
 * @param {string} createdAt - ISO datum
 * @returns {boolean} True om produkten är ny
 */
function isProductNew(createdAt) {
    const productDate = new Date(createdAt);
    const now = new Date();
    const daysDifference = ( now - productDate ) / (1000 * 60 * 60 * 24);

    return daysDifference <= 7;
}

/**
 * Bestäm lagerstatus
 * @param {number} stockQuantity
 * @returns {Object} status objekt med text och css-klass
 */
function getStockStatus(stockQuantity) {
    if (stockQuantity === 0) {
        return { text: 'Slutsåld', class: 'out-of-stock' };
    } else if (stockQuantity <= 5) {
        return { text: 'Få kvar i lager', class: 'low-stock' };
    } else {
        return { text: 'I lager', class: 'in-stock' };
    }
}

/**
 * Formatera pris och valuta
 * @param {number} price
 * @param {string} currency
 * @returns {string} formaterat pris
 */
function formatPrice(price, currency = 'SEK') {
    return `${price} ${currency}`
}

module.exports = {
    isProductNew,
    getStockStatus,
    formatPrice
};