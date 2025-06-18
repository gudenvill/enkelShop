/**
 * @returns {string} HTML content for admin orders page
 */
function generateAdminOrdersPage() {
    return `
        <div class="admin-orders-page">
            <div class="admin-placeholder">
                <h1>Orderhantering</h1>
                <p>Orderhantering kommer i nästa fas av utvecklingen.</p>
                
                <div class="placeholder-features">
                    <h3>Planerade funktioner:</h3>
                    <ul>
                        <li>📋 Visa alla ordrar</li>
                        <li>🔍 Filtrera ordrar efter status</li>
                        <li>✏️ Uppdatera orderstatus</li>
                        <li>👤 Visa kundinformation</li>
                        <li>📦 Hantera leveranser</li>
                        <li>📊 Orderstatistik</li>
                    </ul>
                </div>
                
                <div class="placeholder-actions">
                    <a href="/admin/products" class="btn btn-primary">
                        🔙 Tillbaka till Produkter
                    </a>
                </div>
            </div>
        </div>
    `;
}

module.exports = { generateAdminOrdersPage };