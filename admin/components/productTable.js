/**
 * @param {Array} products - Array of all products (from adminProductService)
 * @returns {string} HTML table with all products
 */
function createProductTable(products) {
    // Handle empty state
    if (!products || products.length === 0) {
        return `
            <div class="empty-state">
                <h3>Inga produkter hittades</h3>
                <p>Klicka på "Lägg till ny produkt" för att skapa din första produkt.</p>
            </div>
        `;
    }

    // Generate table rows for each product
    const productRows = products.map(product => createProductRow(product)).join('');

    return `
        <div class="product-table-container">
            <div class="table-header">
                <h2>Produkthantering</h2>
                <a href="/admin/products/new" class="btn btn-add">
                    ➕ Lägg till ny produkt
                </a>
            </div>

            <div class="table-wrapper">
                <table class="product-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Namn</th>
                            <th>Märke</th>
                            <th>SKU</th>
                            <th>Pris</th>
                            <th>Lager</th>
                            <th>Status</th>
                            <th>Åtgärder</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productRows}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

/**
 * @param {Object} product - Single product object
 * @returns {string} HTML table row
 */
function createProductRow(product) {
    const statusClass = product.is_active ? 'status-active' : 'status-inactive';
    const statusText = product.is_active ? '✅ Aktiv' : '❌ Inaktiv';
    const rowClass = product.is_active ? 'row-active' : 'row-inactive';
    
    // Stock status classes
    let stockClass = 'stock-normal';
    if (product.stock_quantity === 0) {
        stockClass = 'stock-empty';
    } else if (product.stock_quantity < 10) {
        stockClass = 'stock-low';
    }

    return `
        <tr class="${rowClass}">
            <td>${product.id}</td>
            <td class="product-name">${product.name}</td>
            <td>${product.brand}</td>
            <td class="product-sku">${product.sku}</td>
            <td class="product-price">${product.price.toFixed(2)} kr</td>
            <td class="${stockClass}">${product.stock_quantity} st</td>
            <td>
                <span class="${statusClass}">${statusText}</span>
            </td>
            <td class="actions">
                <a href="/admin/products/edit/${product.id}" class="btn btn-edit">
                    ✏️ Redigera
                </a>
                
                <form method="POST" action="/admin/products/toggle/${product.id}" class="inline-form">
                    <button type="submit" class="btn btn-toggle">
                        ${product.is_active ? '🔴 Inaktivera' : '🟢 Aktivera'}
                    </button>
                </form>
                
                <form method="POST" action="/admin/products/delete/${product.id}" class="inline-form">
                    <button type="submit" class="btn btn-delete" 
                            onclick="return confirm('Är du säker på att du vill inaktivera denna produkt?')">
                        🗑️ Ta bort
                    </button>
                </form>
            </td>
        </tr>
    `;
}

module.exports = { createProductTable };