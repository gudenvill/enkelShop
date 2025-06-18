/**
 * Hämta kundvagn från session
 * @param {Object} session
 * @returns {Array} Cart Items ARRAY
 */
function getCart(session) {
    // No cart session
    if (!session.cart) {
        session.cart = [];
    }
    return session.cart;
}

/**
 * Lägg till varur i kundvagn
 * @param {Object} session
 * @param {number} productId
 * @param {number} quantity
 * @returns {boolean} sucsess status
 */
function addToCart(session, productId, quantity = 1) {
    const cart = getCart(session);

    // Kolla om produkten redan finns i vagnen
    const existingItem = cart.find(item => item.productId === productId);

    // Lägga till quant eller skapa ny
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId: productId,
            quantity: quantity,
            addedAt: new Date().toISOString()
        });
    }
    session.cart = cart;
    return true;
}

/**
 * Ta bort produkt från kundvagn
 * @param {Object} session
 * @param {number} productId
 * @returns {boolean} sucsess status
 */
function removeFromCart(session, productId) {
    const cart = getCart(session);
    // Behöll allt förutom den produckten vi försöker ta bort
    session.cart = cart.filter(item => item.productId !== productId);
}

/**
 * Uppdatera kvantitet för produkt
 * @param {Object} session
 * @param {number} productId
 * @param {number} quantity - Nya kvant
 * @returns {boolean} sucsess status
 */
function updateQuantity(session, productId, quantity) {
    const cart = getCart(session);
    const item = cart.find(item => item.productId === productId);

    if (item) {
        if (quantity > 0) {
            item.quantity = quantity;
        } else {
            // ta bort helt om kvant är 0 eller mindre
            return removeFromCart(session, productId);
        }
    }

    return true;
}

/**
 * Töm hela skiten
 * @param {Object} session
 * @returns {boolean} success status
 */
function clearCart(session) {
    session.cart = [];
    return true;
}

/**
 * Räkna antal i vagnen
 * @param {Array} cart
 * @returns {number} antal item count
 */
function getCartItemCount(cart) {
    return cart.reduce((count, item) => count + item.quantity, 0)
}

module.exports = {
    getCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemCount
};
