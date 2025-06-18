/**
 * Checkout form
 * @returns {string} HTML checkout form
 */
function createCheckoutForm() {
    return `
        <form method="POST" action="/checkout/process" class="checkout-form">
            <div class="form-section">
                <h3>Kunduppgifter</h3>
                
                <div class="form-group">
                    <label for="name">Namn *</label>
                    <input type="text" id="name" name="name" required>
                </div>
                
                <div class="form-group">
                    <label for="email">E-post *</label>
                    <input type="email" id="email" name="email" required>
                </div>
                
                <div class="form-group">
                    <label for="phone">Telefon</label>
                    <input type="tel" id="phone" name="phone">
                </div>
            </div>

            <div class="form-section">
                <h3>Leveransadress</h3>
                
                <div class="form-group">
                    <label for="address">Adress *</label>
                    <textarea id="address" name="address" rows="3" required placeholder="Gatuadress, Postnummer, Stad"></textarea>
                </div>
            </div>

            <div class="form-section">
                <h3>Betalningsmetod</h3>
                
                <div class="form-group">
                    <label>
                        <input type="radio" name="payment_method" value="card" checked>
                        💳 Kort
                    </label>
                </div>
                
                <div class="form-group">
                    <label>
                        <input type="radio" name="payment_method" value="invoice">
                        📄 Faktura
                    </label>
                </div>
            </div>

            <div class="form-actions">
                <a href="/cart" class="btn btn-secondary">← Tillbaka till kundvagn</a>
                <button type="submit" class="btn btn-primary">Slutför beställning</button>
            </div>
        </form>
    `;
}

module.exports = { createCheckoutForm };