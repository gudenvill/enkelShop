const fs = require('fs');
const path = require('path');
const { loadProducts } = require('./productService');

const ORDERS_FILE = path.join(__dirname, '../data/orders.json');

/**
 * Generera unique order nummer
 * @returns {string}
 */
function generateOrderNumber() {
    const today = new Date()
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

    const orders = loadOrders();
    const todayOrders = orders.filter(order => 
        order.order_number.startsWith(`ORD-${dateStr}`)
    );

    const nextNumber = (todayOrders.length + 1).toString().padStart(3, '0');
    return `ORD-${dateStr}-${nextNumber}`;
}

/**
 * Ladda alla order
 * @returns {Array}
 */
function loadOrders() {
    try {
        if (!fs.existsSync(ORDERS_FILE)) {
            return [];
        } 
        const ordersData = fs.readFileSync(ORDERS_FILE, 'utf8');
        const orders = JSON.parse(ordersData);
        return orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } catch (error) {
        console.error('Fel vid laddning av ordrar:', error);
        return [];
    }
}

/**
 * Save Order to file
 * @param {Array} orders 
 * @returns {boolean}
 */
function saveOrders(orders) {
    try {
        const jsonData = JSON.stringify(orders, null, 2);
        fs.writeFileSync(ORDERS_FILE, jsonData, 'utf8');
        return true;
    } catch (error) {
        console.error('Fel vid sparande av ordrar:', error);
        return false;
    }
}

/**
 * Skapa Order från form
 * @param {Object} customerData -
 * @param {Array} cartItems -
 * @returns {Object} Result with success/error and order data
 */
function createOrder(customerData, cartItems) {
    try {
        // Validate cart not empty
        if (!cartItems || cartItems.length === 0) {
            return { success: false, error: 'Kundvagnen är tom' };
        }

        // Load products to get current data and validate stock
        const products = loadProducts();
        const orderItems = [];
        let totalAmount = 0;

        // Process each cart item
        for (const cartItem of cartItems) {
            const product = products.find(p => p.id === cartItem.productId && p.is_active);
            
            if (!product) {
                return { success: false, error: `Produkt med ID ${cartItem.productId} finns inte längre` };
            }

            if (cartItem.quantity > product.stock_quantity) {
                return { success: false, error: `Otillräckligt lager för ${product.name}` };
            }

            const itemTotal = product.price * cartItem.quantity;
            totalAmount += itemTotal;

            orderItems.push({
                product_id: product.id,
                product_name: product.name,
                product_brand: product.brand,
                product_sku: product.sku,
                quantity: cartItem.quantity,
                price: product.price,
                subtotal: itemTotal
            });
        }

        // Create order object
        const order = {
            id: Date.now(), // Simple ID generation
            order_number: generateOrderNumber(),
            customer_name: customerData.name,
            customer_email: customerData.email,
            customer_phone: customerData.phone || '',
            shipping_address: customerData.address,
            payment_method: customerData.payment_method || 'card',
            total_amount: totalAmount,
            status: 'pending',
            items: orderItems,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        // Save order
        const orders = loadOrders();
        orders.push(order);
        const saveSuccess = saveOrders(orders);

        if (saveSuccess) {
            console.log('✅ Order skapad:', order.order_number);
            return { success: true, order: order };
        } else {
            return { success: false, error: 'Kunde inte spara ordern' };
        }

    } catch (error) {
        console.error('Fel vid skapande av order:', error);
        return { success: false, error: 'Serverfel vid orderbehandling' };
    }
}

/**
 * Get order by order number
 * @param {string} orderNumber 
 * @returns {Object|null}
 */
function getOrderByNumber(orderNumber) {
    const orders = loadOrders();
    return orders.find(order => order.order_number === orderNumber) || null;
}

module.exports = {
    generateOrderNumber,
    loadOrders,
    createOrder,
    getOrderByNumber
};
