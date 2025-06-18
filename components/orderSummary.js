const { loadProducts } = require('../services/productService');

/**
 * Order summary
 * @param {Array} cartItems 
 * @returns {string}
 */
function createOrderSummary(cartItems) {
    if (!cartItems || cartItems.length === 0) {
        return `
            <div class="order-summary-empty">
                <p>Kundvagnen är tom</p>
                <a href="/" class="btn btn-primary">Fortsätt handla</a>
            </div>
        `;
    }

    const products = loadProducts();
    let totalAmount = 0;
    
    const summaryItems = cartItems.map(cartItem => {
        const product = products.find(p => p.id === cartItem.productId);
        if (!product) return '';
        
        const itemTotal = product.price * cartItem.quantity;
        totalAmount += itemTotal;
        
        return `
            <div class="summary-item">
                <div class="item-details">
                    <strong>${product.name}</strong>
                    <div class="item-meta">${product.brand} • ${product.sku}</div>
                </div>
                <div class="item-quantity">${cartItem.quantity} st</div>
                <div class="item-price">${itemTotal.toFixed(2)} kr</div>
            </div>
        `;
    }).join('');

    return `
        <div class="order-summary">
            <h3>Ordersammanfattning</h3>
            <div class="summary-items">
                ${summaryItems}
            </div>
            <div class="summary-total">
                <strong>Totalt: ${totalAmount.toFixed(2)} kr</strong>
            </div>
        </div>
    `;
}

module.exports = { createOrderSummary };