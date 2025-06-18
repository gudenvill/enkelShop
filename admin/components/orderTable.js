/**
 * Create order table for admin
 * @param {Array} orders 
 * @returns {string} HTML table
 */
function createOrderTable(orders) {
    if (!orders || orders.length === 0) {
        return `
            <div class="empty-state">
                <h3>Inga ordrar hittades</h3>
                <p>Ordrar kommer att visas här när kunder lägger beställningar.</p>
            </div>
        `;
    }

    const orderRows = orders.map(order => createOrderRow(order)).join('');

    return `
        <div class="order-table-container">
            <div class="table-header">
                <h2>Orderhantering</h2>
            </div>

            <div class="table-wrapper">
                <table class="order-table">
                    <thead>
                        <tr>
                            <th>Ordernummer</th>
                            <th>Kund</th>
                            <th>Datum</th>
                            <th>Artiklar</th>
                            <th>Summa</th>
                            <th>Status</th>
                            <th>Åtgärder</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orderRows}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

/**
 * Create single order row
 * @param {Object} order 
 * @returns {string} HTML table row
 */
function createOrderRow(order) {
    const statusClass = getStatusClass(order.status);
    const statusText = getStatusText(order.status);
    const date = new Date(order.created_at).toLocaleDateString('sv-SE');
    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

    return `
        <tr class="order-row status-${order.status}">
            <td class="order-number">${order.order_number}</td>
            <td class="customer-info">
                <div>${order.customer_name}</div>
                <small>${order.customer_email}</small>
            </td>
            <td>${date}</td>
            <td>${itemCount} st</td>
            <td class="order-total">${order.total_amount.toFixed(2)} kr</td>
            <td>
                <span class="${statusClass}">${statusText}</span>
            </td>
            <td class="actions">
                <select onchange="updateOrderStatus('${order.order_number}', this.value)" class="status-select">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                    <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
                
                <button onclick="viewOrderDetails('${order.order_number}')" class="btn btn-view">
                    👁️ Visa
                </button>
            </td>
        </tr>
    `;
}

function getStatusClass(status) {
    const classes = {
        pending: 'status-pending',
        processing: 'status-processing', 
        shipped: 'status-shipped',
        completed: 'status-completed',
        cancelled: 'status-cancelled'
    };
    return classes[status] || 'status-pending';
}

function getStatusText(status) {
    const texts = {
        pending: '⏳ Pending',
        processing: '⚙️ Processing',
        shipped: '🚚 Shipped', 
        completed: '✅ Completed',
        cancelled: '❌ Cancelled'
    };
    return texts[status] || '⏳ Pending';
}

module.exports = { createOrderTable };