const { createCheckoutForm } = require('../components/checkoutForm');
const { createOrderSummary } = require('../components/orderSummary');
const { getCart } = require('../services/cartService');

/**
 * Generate checkout page 
 * @param {Object} session -
 * @returns {string} 
 */
function generateCheckoutPage(session) {
    const cartItems = getCart(session);
    
    // Redirect if cart is empty
    if (!cartItems || cartItems.length === 0) {
        return `
            <div class="checkout-empty">
                <h1>Kundvagnen är tom</h1>
                <p>Du måste lägga till produkter i kundvagnen innan du kan gå till kassan.</p>
                <a href="/" class="btn btn-primary">Fortsätt handla</a>
            </div>
        `;
    }

    return `
        <div class="checkout-page">
            <h1>Kassa</h1>
            
            <div class="checkout-container">
                <div class="checkout-form-section">
                    ${createCheckoutForm()}
                </div>
                
                <div class="checkout-summary-section">
                    ${createOrderSummary(cartItems)}
                </div>
            </div>
        </div>
    `;
}

module.exports = { generateCheckoutPage };