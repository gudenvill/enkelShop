const { isProductNew } = require('../utils/productUtils'); 

/**
 * @param {Object} product - produktdata från databas
 * @returns {string} HTML för produktkort med klickbara länkar
 */
function createProductCard(product) {
    // kontrollera om produkten är ny ?
    const isNew = isProductNew(product.created_at);

    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <a href="/product/${product.id}">
                    <img src="${product.image_url}" alt="${product.name}">
                </a>
                ${isNew ? '<span class="new-badge">Nyhet!</span>' : ''}
            </div>

            <div class="product-info">
                <a href="/product/${product.id}">
                    <h3>${product.name}</h3>
                </a>
                <p class="brand">${product.brand}</p>
                <p class="price">${product.price} SEK</p>
            </div>
        </div>
    `;
}

module.exports = { createProductCard };