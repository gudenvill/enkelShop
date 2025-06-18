const { loadOrders } = require('../../services/orderService');

/**
 * Get all orders
 * @returns {Object} Orders and statistics
 */
function getOrdersWithStats() {
    const orders = loadOrders();
    
    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        completed: orders.filter(o => o.status === 'completed').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length
    };
    
    return { orders, stats };
}

/**
 * Update order status
 * @param {string} orderNumber 
 * @param {string} newStatus 
 * @returns {Object} Result
 */
function updateOrderStatus(orderNumber, newStatus) {
    const fs = require('fs');
    const path = require('path');
    const ORDERS_FILE = path.join(__dirname, '../../data/orders.json');
    
    try {
        const orders = loadOrders();
        const orderIndex = orders.findIndex(o => o.order_number === orderNumber);
        
        if (orderIndex === -1) {
            return { success: false, error: 'Order not found' };
        }
        
        orders[orderIndex].status = newStatus;
        orders[orderIndex].updated_at = new Date().toISOString();
        
        const jsonData = JSON.stringify(orders, null, 2);
        fs.writeFileSync(ORDERS_FILE, jsonData, 'utf8');
        
        return { success: true, order: orders[orderIndex] };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

module.exports = {
    getOrdersWithStats,
    updateOrderStatus
};