/**
 * @returns {string}
 */
function createAdminNav() {
    return `
        <nav class="admin-nav">
            <div class="nav-container">
                <a href="/" class="back-to-store">
                    ← Tillbaka till Butik
                </a>
                
                <div class="nav-links">
                    <a href="/admin/products" class="nav-link nav-products">
                        📦 Produkter
                    </a>
                    
                    <a href="/admin/orders" class="nav-link nav-orders">
                        📋 Ordrar
                    </a>
                </div>
            </div>
        </nav>
    `;
}

module.exports = { createAdminNav };