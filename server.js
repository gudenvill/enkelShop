// EnkelShop Server //
const express = require('express');
const path = require('path');
const fs = require('fs');

// Hämta Componenter
const { createLayout } = require('./components/layout');
const { generateHomepage } = require('./pages/homepage');
const { loadProducts } = require('./services/productService');

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

app.listen(PORT, () => {
    console.log(`📍 http://localhost:${PORT}`);
})