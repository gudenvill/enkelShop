/**
 * @param {Array} cart
 * @param {Array} products
 * @returns {string} HTML för summary
 */
function createCartSummary(cart, products) {
    let subtotal = 0;
    let itemCount = 0;

    // Räkna ut totaler
    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.productId);
        if (product) {
            subtotal += product.price * cartItem.quantity;
            itemCount += cartItem.quantity
        }
    });

    const shippingCost = subtotal > 500 ? 0 : 49;
    const total = subtotal + shippingCost;

    return `
        <div class="cart-summary">
            <h3>Ordersammanfattning</h3>
            
            <div class="summary-line">
                <span>Artiklar (${itemCount} st):</span>
                <span>${subtotal} SEK</span>
            </div>
            
            <div class="summary-line">
                <span>Frakt:</span>
                <span>${shippingCost === 0 ? 'Gratis' : shippingCost + ' SEK'}</span>
            </div>
            
            ${shippingCost > 0 ? `
                <div class="shipping-info">
                    <small>Fri frakt vid köp över 500 SEK</small>
                </div>
            ` : ''}
            
            <hr>
            
            <div class="summary-total">
                <span><strong>Totalt:</strong></span>
                <span><strong>${total} SEK</strong></span>
            </div>
            
            <div class="cart-actions">
                <form action="/checkout" method="GET">
                    <button type="submit" class="checkout-btn">
                        Gå till kassan
                    </button>
                </form>
                
                <form action="/cart/clear" method="POST" style="margin-top: 10px;">
                    <button type="submit" class="clear-cart-btn" onclick="return confirm('Är du säker på att du vill tömma varukorgen?')">
                        Töm varukorg
                    </button>
                </form>
            </div>
        </div>
    `;
}

module.exports = { createCartSummary };