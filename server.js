// EnkelShop Server //
const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');

// Cart utils
const { addToCart, removeFromCart, updateQuantity, getCart } = require('./services/cartService');


// Hämta Componenter
const { createLayout } = require('./components/layout');

// Hämta Pages
const { generateCartPage } = require('./pages/cart');
const { generateHomepage } = require('./pages/homepage');
const { generateProductDetailPage } = require('./pages/productDetail');

// Hämta Services
const { loadProducts } = require('./services/productService');
const { clearCart } = require('./services/cartService');

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

// Start server
app.listen(PORT, () => {
    console.log(`📍 http://localhost:${PORT}`);
});