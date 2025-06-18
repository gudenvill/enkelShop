/**
 * @param {Object} cartItem - Cart item från session
 * @param {Object} product - Produktdata från JSON
 * @returns {string} HTML för cart item
 */
function createCartItem(cartItem, product) {
    if (!product) {
        // Produkten finns inte längre - visa fel
        return `
            <div class="cart-item cart-item-error">
                <div class="cart-item-error-content">
                    <h4>Produkten är inte längre tillgänglig</h4>
                    <p>Produkt ID: ${cartItem.productId}</p>
                    <form action="/cart/remove" method="POST" style="display: inline;">
                        <input type="hidden" name="productId" value="${cartItem.productId}">
                        <button type="submit" class="remove-btn">Ta bort</button>
                    </form>
                </div>
            </div>
        `;
    }

    const itemTotal = product.price * cartItem.quantity;

    return `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${product.image_url}" alt="${product.name}" width="80">
            </div>
            
            <div class="cart-item-details">
                <h4><a href="/product/${product.id}">${product.name}</a></h4>
                <p class="cart-item-brand">${product.brand}</p>
                <p class="cart-item-sku">Art.nr: ${product.sku}</p>
                <p class="cart-item-price">${product.price} SEK/st</p>
            </div>
            
            <div class="cart-item-quantity">
                <form action="/cart/update" method="POST" class="quantity-form">
                    <input type="hidden" name="productId" value="${product.id}">
                    <label for="quantity-${product.id}">Antal:</label>
                    <div class="quantity-controls">
                        <input 
                            type="number" 
                            id="quantity-${product.id}"
                            name="quantity" 
                            value="${cartItem.quantity}" 
                            min="1" 
                            max="${product.stock_quantity}"
                            class="quantity-input"
                        >
                        <button type="submit" class="update-btn">Uppdatera</button>
                    </div>
                </form>
            </div>
            
            <div class="cart-item-total">
                <p class="item-total-price">${itemTotal} SEK</p>
            </div>
            
            <div class="cart-item-actions">
                <form action="/cart/remove" method="POST">
                    <input type="hidden" name="productId" value="${product.id}">
                    <button type="submit" class="remove-btn">
                        <i class="fas fa-trash"></i> Ta bort
                    </button>
                </form>
            </div>
        </div>
    `;
}

module.exports = { createCartItem };