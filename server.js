// EnkelShop Server //
const express = require('express');
const path = require('path');
const fs = require('fs');

// Hämta Componenter
const { createLayout } = require('./components/layout');
const { generateHomepage } = require('./pages/homepage');
const { loadProducts } = require('./services/productService');
const { generateProductDetailPage } = require('./pages/productDetail');

// Init express
const app = express();
const PORT = process.env.PORT || 3000;

// Använder express inbyggda body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Servera statiska filer som bilder och css
app.use(express.static(path.join(__dirname, 'public')));

// Homepage Route
app.get('/', (req, res) => {
    const mainContent = generateHomepage();
    const html = createLayout(mainContent, 'EnkelShop | Hem');
    res.send(html);
});

// API test
app.get('/api/test', (req, res) => {
    res.json({
        message: 'EnkelShop API fungerar!',
        timestamp: new Date().toISOString()
    })
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

// Single Product API
app.get('/product/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const pageData = generateProductDetailPage(productId);

    // Hantera fel (404, inaktiva produkter)
    if (pageData.error) {
        res.status(pageData.statusCode);
    }

    // Skapa komplett HTML med layout
    const html = createLayout(pageData.content, pageData.title);
    res.send(html);
})

app.listen(PORT, () => {
    console.log(`📍 http://localhost:${PORT}`);
})