const { getCart, getCartItemCount } = require('../services/cartService');

/**
 * Skapa kundvagn räknare header
 * @param {Object} session
 * @returns {string} HTML för cart counter
 */
function createCartCounter(session) {
    const cart = getCart(session);
    const itemCount = getCartItemCount(cart);

    return `
        <a href="/cart" aria-label="Shopping Basket" class="cart-link">
            <i class="fas fa-shopping-basket"></i>
            ${itemCount > 0 ? `<span class="cart-badge">${itemCount}</span>` : ''}
        </a>
    `;
}

module.exports = { createCartCounter };