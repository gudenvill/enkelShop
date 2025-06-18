const { createCartItem } = require('../components/cartItem');
const { createCartSummary } = require('../components/cartSummary');
const { getCart } = require('../services/cartService');
const { loadProducts } = require('../services/productService');

/**
 * @param {Object} session
 * @returns {string} HTML För cart sida
 */
function generateCartPage(session) {
    const cart = getCart(session);
    const products = loadProducts();

    // TOM
    if (cart.length === 0) {
        return createEmptyCartPage();
    }

    // Chart items generation
    const cartItemsHtml = cart.map(cartItem => {
        const product = products.find(p => p.id === cartItem.productId);
        return createCartItem(cartItem, product);
    }).join('');

    // Filtrera bort produkter som inte finns (för summary)
    const validCartItems = cart.filter(cartItem => {
        return products.find(p => p.id === cartItem.productId);
    });

    const cartSummaryHtml = createCartSummary(validCartItems, products);

    return `
        <div class="cart-page">
            <div class="cart-header">
                <h1>Din varukorg</h1>
                <p>Du har ${cart.length} artiklar i din varukorg</p>
            </div>
            
            <div class="cart-content">
                <div class="cart-items">
                    ${cartItemsHtml}
                </div>
                
                <div class="cart-sidebar">
                    ${cartSummaryHtml}
                </div>
            </div>
            
            <div class="continue-shopping">
                <a href="/">&larr; Fortsätt handla</a>
            </div>
        </div>
    `;
}

/**
 * Skapa tom varukorg sida
 * @returns {string} HTML för tom cart
 */
function createEmptyCartPage() {
    return `
        <div class="empty-cart">
            <div class="empty-cart-content">
                <i class="fas fa-shopping-basket empty-cart-icon"></i>
                <h2>Din varukorg är tom</h2>
                <p>Det ser ut som om du inte har lagt till några produkter i din varukorg än.</p>
                
                <div class="empty-cart-actions">
                    <a href="/" class="continue-shopping-btn">
                        Börja handla
                    </a>
                </div>
            </div>
        </div>
    `;
}

module.exports = { generateCartPage };
