const { createOrderConfirmation } = require('../components/orderConfirmation');

/**
 * Generate order confirmation 
 * @param {Object} order 
 * @returns {string} 
 */
function generateOrderConfirmationPage(order) {
    if (!order) {
        return `
            <div class="order-not-found">
                <h1>Order hittades inte</h1>
                <p>Den begärda ordern kunde inte hittas.</p>
                <a href="/" class="btn btn-primary">Tillbaka till startsidan</a>
            </div>
        `;
    }

    return `
        <div class="order-confirmation-page">
            ${createOrderConfirmation(order)}
        </div>
    `;
}

module.exports = { generateOrderConfirmationPage };