const { loadAllProducts } = require('../services/adminProductService');
const { createProductTable } = require('../components/productTable');

/**
 * Generate Admin Products Page
 * @returns {string} 
 */
function generateAdminProductsPage() {
    try {
        // Load ALL products (including inactive ones) using admin service
        const allProducts = loadAllProducts();
        
        // Get some statistics for the header
        const totalProducts = allProducts.length;
        const activeProducts = allProducts.filter(p => p.is_active).length;
        const inactiveProducts = totalProducts - activeProducts;
        
        // Create the page content
        const pageContent = `
            <div class="admin-products-page">
                <div class="admin-stats">
                    <h1>Produktöversikt</h1>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <strong>${totalProducts}</strong>
                            <span>Totalt produkter</span>
                        </div>
                        <div class="stat-item">
                            <strong>${activeProducts}</strong>
                            <span>Aktiva produkter</span>
                        </div>
                        <div class="stat-item">
                            <strong>${inactiveProducts}</strong>
                            <span>Inaktiva produkter</span>
                        </div>
                    </div>
                </div>
                
                ${createProductTable(allProducts)}
            </div>
        `;
        
        return pageContent;
        
    } catch (error) {
        console.error('Fel vid generering av admin produktsida:', error);
        
        // Return error page
        return `
            <div class="admin-error">
                <h2>Fel vid laddning av produkter</h2>
                <p>Kunde inte ladda produktdata. Kontrollera att data/products.json finns och är korrekt formaterad.</p>
                <p>Felmeddelande: ${error.message}</p>
                <a href="/admin/products" class="btn btn-retry">🔄 Försök igen</a>
            </div>
        `;
    }
}

module.exports = { generateAdminProductsPage };