/**
 * @param {Object} product - produktdata från databas
 * @returns {string} HTML för produktkort
 */
function createProductCard(product) {
    // kontrollera om produkten är ny ?
    const isNew = isProductNew(product.created_at);

    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image_url}" alt="${product.name}">
                ${isNew ? '<span class="new-badge">Nyhet!</span>' : ''}
            </div>

            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="brand">${product.brand}</p>
                <p class="price">${product.price} SEK</p>
            </div>
        </div>
    `;
}

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

module.exports = { createProductCard };