// EnkelShop Server //
const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');

// Cart utils
const { addToCart, removeFromCart, updateQuantity, getCart } = require('./services/cartService');

// Hämta ADMIN
const { createAdminLayout } = require('./admin/components/adminLayout');
const { generateAdminProductsPage } = require('./admin/pages/adminProducts');
const { generateAdminOrdersPage } = require('./admin/pages/adminOrders');
const { 
    createProduct, 
    updateProduct, 
    deleteProduct 
} = require('./admin/services/adminProductService');

// Hämta Componenter
const { createLayout } = require('./components/layout');

// Hämta Pages
const { generateCartPage } = require('./pages/cart');
const { generateHomepage } = require('./pages/homepage');
const { generateProductDetailPage } = require('./pages/productDetail');
const { generateCheckoutPage } = require('./pages/checkout');
const { generateOrderConfirmationPage } = require('./pages/orderConfirmation');


// Hämta Services
const { loadProducts } = require('./services/productService');
const { clearCart } = require('./services/cartService');
const { createOrder, getOrderByNumber } = require('./services/orderService');
const { updateOrderStatus } = require('./admin/services/adminOrderService');



// Hämta Utils
const { generateSearchResults } = require('./utils/searchUtils');

// Init express
const app = express();
const PORT = process.env.PORT || 3000;

// Använder express inbyggda body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Adda SESSION middleware
app.use(session({
    secret: 'enkeltshop-secret-key-2025',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}))

// Servera statiska filer som bilder och css
app.use(express.static(path.join(__dirname, 'public')));

// Homepage Route (with search support)
app.get('/', (req, res) => {
    const searchQuery = req.query.q;
    
    let mainContent;
    let pageTitle;
    
    if (searchQuery) {
        // Användare söker - visa sökresultat
        mainContent = generateSearchResults(searchQuery);
        pageTitle = `Sök: ${searchQuery} | EnkelShop`;
    } else {
        // Normal hemsida - visa alla produkter
        mainContent = generateHomepage();
        pageTitle = 'EnkelShop | Hem';
    }
    
    const html = createLayout(mainContent, pageTitle, req.session);
    res.send(html);
});

// Single Product Route
app.get('/product/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const pageData = generateProductDetailPage(productId);

    if (pageData.error) {
        res.status(pageData.statusCode);
    }

    const html = createLayout(pageData.content, pageData.title, req.session);
    res.send(html);
});

// API test
app.get('/api/test', (req, res) => {
    res.json({
        message: 'EnkelShop API fungerar!',
        timestamp: new Date().toISOString()
    });
});

// Products API
app.get('/api/products', (req, res) => {
    try {
        const products = loadProducts();

        res.json({
            success: true,
            count: products.length,
            products: products
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Kunde inte ladda produkter'
        });
    }
});

// Search API
app.get('/api/search', (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.json({ 
            success: false, 
            error: 'Sökfråga krävs' 
        });
    }

    try {
        const allProducts = loadProducts();
        const results = allProducts.filter(product =>
            product.is_active &&
            product.name.toLowerCase().includes(query.toLowerCase())
        );

        res.json({
            success: true,
            query: query,
            count: results.length,
            products: results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Kunde inte söka produkter'
        });
    }
});

// Cart page route
app.get('/cart', (req, res) => {
    const cartContent = generateCartPage(req.session);
    const html = createLayout(cartContent, 'Varukorg | EnkelShop', req.session);
    res.send(html);
});

// Clear entire cart
app.post('/cart/clear', (req, res) => {
    clearCart(req.session);
    res.redirect('/cart');
});

// Add to cart
app.post('/cart/add', (req, res) => {
    const { productId, quantity } = req.body;
    const productIdInt = parseInt(productId);
    const quantityInt = parseInt(quantity) || 1;

    // validera att produkten finns
    const products = loadProducts();
    const product = products.find(p => p.id === productIdInt && p.is_active);

    if (!product) {
        // om inte finns redirect till error sida
        return res.redirect(`/product/${productIdInt}?error=product-not-found`);
    }

    if (quantityInt > product.stock_quantity) {
        // För många - redirect med fel
        return res.redirect(`/product/${productIdInt}?error=insufficient-stock`);
    }

    // Lägg till cart
    addToCart(req.session, productIdInt, quantityInt);

    // Redirect tillbaka till produktsidan med success
    res.redirect(`/product/${productIdInt}?success=added-to-cart`);
});

// Remove from cart 
app.post('/cart/remove', (req, res) => {
    const { productId } = req.body;
    removeFromCart(req.session, parseInt(productId));
    res.redirect('/cart');
});

// Update cart quantity
app.post('/cart/update', (req, res) => {
    const { productId, quantity } = req.body;
    updateQuantity(req.session, parseInt(productId), parseInt(quantity));
    res.redirect('/cart');
})

// Checkout Routes
app.get('/checkout', (req, res) => {
    const checkoutContent = generateCheckoutPage(req.session);
    const html = createLayout(checkoutContent, 'Kassa | EnkelShop', req.session);
    res.send(html);
});

// Process checkout
app.post('/checkout/process', (req, res) => {
    const cartItems = getCart(req.session);
    
    if (!cartItems || cartItems.length === 0) {
        return res.redirect('/cart?error=empty-cart');
    }
    
    const result = createOrder(req.body, cartItems);
    
    if (result.success) {
        // Clear cart after successful order
        req.session.cart = [];
        console.log('✅ Order processed:', result.order.order_number);
        res.redirect(`/order-confirmation/${result.order.order_number}`);
    } else {
        console.error('❌ Checkout error:', result.error);
        res.redirect('/checkout?error=' + encodeURIComponent(result.error));
    }
});

// Order confirmation page
app.get('/order-confirmation/:orderNumber', (req, res) => {
    const order = getOrderByNumber(req.params.orderNumber);
    const confirmationContent = generateOrderConfirmationPage(order);
    const html = createLayout(confirmationContent, 'Orderbekräftelse | EnkelShop', req.session);
    res.send(html);
});

// Individual order view
app.get('/order/:orderNumber', (req, res) => {
    const order = getOrderByNumber(req.params.orderNumber);
    const confirmationContent = generateOrderConfirmationPage(order);
    const html = createLayout(confirmationContent, `Order ${req.params.orderNumber} | EnkelShop`, req.session);
    res.send(html);
});


//  --- ADMIN ENDPOINTS --- //

// Admin Products Page
app.get('/admin/products', (req, res) => {
    try {
        const adminContent = generateAdminProductsPage();
        const html = createAdminLayout(adminContent, 'Produkthantering');
        res.send(html);
    } catch (error) {
        console.error('Fel vid admin produktsida:', error);
        res.status(500).send('Serverfel vid laddning av admin produkter');
    }
});

// Admin Orders Page  
app.get('/admin/orders', (req, res) => {
    try {
        const adminContent = generateAdminOrdersPage();
        const html = createAdminLayout(adminContent, 'Orderhantering');
        res.send(html);
    } catch (error) {
        console.error('Fel vid admin ordersida:', error);
        res.status(500).send('Serverfel vid laddning av admin ordrar');
    }
});

// Update order status
app.post('/admin/orders/:orderNumber/status', express.json(), (req, res) => {
    const { orderNumber } = req.params;
    const { status } = req.body;
    
    const result = updateOrderStatus(orderNumber, status);
    
    if (result.success) {
        console.log('✅ Order status updated:', orderNumber, '→', status);
        res.json({ success: true });
    } else {
        console.error('❌ Order update error:', result.error);
        res.status(500).json({ success: false, error: result.error });
    }
});

//  ---- ADMIN CRUD ROUTES    ---- //

// Create Product (POST)
app.post('/admin/products/create', (req, res) => {
    const result = createProduct(req.body);
    
    if (result.success) {
        console.log('✅ Ny produkt skapad:', result.product.name);
        res.redirect('/admin/products?success=product-created');
    } else {
        console.error('❌ Fel vid produktskapande:', result.error);
        res.redirect('/admin/products?error=' + encodeURIComponent(result.error));
    }
});

// Update Product (POST)
app.post('/admin/products/update/:id', (req, res) => {
    const productId = req.params.id;
    const result = updateProduct(productId, req.body);
    
    if (result.success) {
        console.log('✅ Produkt uppdaterad:', result.product.name);
        res.redirect('/admin/products?success=product-updated');
    } else {
        console.error('❌ Fel vid produktuppdatering:', result.error);
        res.redirect('/admin/products?error=' + encodeURIComponent(result.error));
    }
});

// Toggle Product Status (POST)
app.post('/admin/products/toggle/:id', (req, res) => {
    const productId = req.params.id;
    
    // Load product to get current status
    const { loadAllProducts } = require('./admin/services/adminProductService');
    const products = loadAllProducts();
    const product = products.find(p => p.id === parseInt(productId));
    
    if (!product) {
        return res.redirect('/admin/products?error=product-not-found');
    }
    
    // Toggle the status
    const result = updateProduct(productId, { is_active: !product.is_active });
    
    if (result.success) {
        const statusText = result.product.is_active ? 'aktiverad' : 'inaktiverad';
        console.log(`✅ Produkt ${statusText}:`, result.product.name);
        res.redirect('/admin/products?success=product-status-updated');
    } else {
        console.error('❌ Fel vid statusändring:', result.error);
        res.redirect('/admin/products?error=' + encodeURIComponent(result.error));
    }
});

// Delete Product (POST) - Soft delete
app.post('/admin/products/delete/:id', (req, res) => {
    const productId = req.params.id;
    const result = deleteProduct(productId);
    
    if (result.success) {
        console.log('✅ Produkt inaktiverad:', result.message);
        res.redirect('/admin/products?success=product-deleted');
    } else {
        console.error('❌ Fel vid produktborttagning:', result.error);
        res.redirect('/admin/products?error=' + encodeURIComponent(result.error));
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`🛠️  Admin kiresh ghashange: http://localhost:${PORT}/admin/products`);
});