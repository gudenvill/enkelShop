/**
 * Order confirmation 
 * @param {Object} order 
 * @returns {string} HTML order confirmation
 */
function createOrderConfirmation(order) {
    const itemsList = order.items.map(item => `
        <div class="confirmation-item">
            <span>${item.product_name} (${item.product_brand})</span>
            <span>${item.quantity} st × ${item.price.toFixed(2)} kr = ${item.subtotal.toFixed(2)} kr</span>
        </div>
    `).join('');

    return `
        <div class="order-confirmation">
            <div class="confirmation-header">
                <h1>✅ Tack för din beställning!</h1>
                <p>Din order har tagits emot och kommer att behandlas inom kort.</p>
            </div>

            <div class="order-details">
                <h2>Orderdetaljer</h2>
                <div class="order-info">
                    <div><strong>Ordernummer:</strong> ${order.order_number}</div>
                    <div><strong>Datum:</strong> ${new Date(order.created_at).toLocaleDateString('sv-SE')}</div>
                    <div><strong>Status:</strong> Pending</div>
                </div>

                <h3>Beställda produkter</h3>
                <div class="order-items">
                    ${itemsList}
                </div>

                <div class="order-total">
                    <strong>Totalt: ${order.total_amount.toFixed(2)} kr</strong>
                </div>
            </div>

            <div class="customer-details">
                <h3>Leveransuppgifter</h3>
                <div><strong>Namn:</strong> ${order.customer_name}</div>
                <div><strong>E-post:</strong> ${order.customer_email}</div>
                ${order.customer_phone ? `<div><strong>Telefon:</strong> ${order.customer_phone}</div>` : ''}
                <div><strong>Adress:</strong><br>${order.shipping_address.replace(/\n/g, '<br>')}</div>
                <div><strong>Betalning:</strong> ${order.payment_method === 'card' ? 'Kort' : 'Faktura'}</div>
            </div>

            <div class="confirmation-actions">
                <a href="/" class="btn btn-primary">Fortsätt handla</a>
                <a href="/order/${order.order_number}" class="btn btn-secondary">Visa order</a>
            </div>
        </div>
    `;
}

module.exports = { createOrderConfirmation };