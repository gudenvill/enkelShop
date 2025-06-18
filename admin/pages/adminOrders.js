const { getOrdersWithStats } = require('../services/adminOrderService');
const { createOrderTable } = require('../components/orderTable');

/**
 * Generate Admin Orders Page
 * @returns {string} HTML content for admin orders page
 */
function generateAdminOrdersPage() {
    try {
        const { orders, stats } = getOrdersWithStats();
        
        return `
            <div class="admin-orders-page">
                <div class="admin-stats">
                    <h1>Orderöversikt</h1>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <strong>${stats.total}</strong>
                            <span>Totalt ordrar</span>
                        </div>
                        <div class="stat-item">
                            <strong>${stats.pending}</strong>
                            <span>Pending</span>
                        </div>
                        <div class="stat-item">
                            <strong>${stats.completed}</strong>
                            <span>Completed</span>
                        </div>
                        <div class="stat-item">
                            <strong>${stats.cancelled}</strong>
                            <span>Cancelled</span>
                        </div>
                    </div>
                </div>
                
                ${createOrderTable(orders)}
                
                <script>
                    function updateOrderStatus(orderNumber, newStatus) {
                        fetch(\`/admin/orders/\${orderNumber}/status\`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ status: newStatus })
                        }).then(() => location.reload());
                    }
                    
                    function viewOrderDetails(orderNumber) {
                        window.open(\`/order/\${orderNumber}\`, '_blank');
                    }
                </script>
            </div>
        `;
        
    } catch (error) {
        console.error('Fel vid admin ordersida:', error);
        return `
            <div class="admin-error">
                <h2>Fel vid laddning av ordrar</h2>
                <p>Kunde inte ladda orderdata.</p>
                <a href="/admin/orders" class="btn btn-retry">🔄 Försök igen</a>
            </div>
        `;
    }
}

module.exports = { generateAdminOrdersPage };