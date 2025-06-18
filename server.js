// EnkelShop Server //
const express = require('express');
const path = require('path');
const fs = require('fs');

// Hämta Componenter
const { createLayout } = require('./components/layout');
const { generateHomepage } = require('./pages/homepage');
const { loadProducts } = require('./services/productService');
const { generateProductDetailPage } = require('./pages/productDetail');
const { generateSearchResults } = require('./utils/searchUtils');

// Init express
const app = express();
const PORT = process.env.PORT || 3000;

// Använder express inbyggda body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    
    const html = createLayout(mainContent, pageTitle);
    res.send(html);
});

// Single Product Route
app.get('/product/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const pageData = generateProductDetailPage(productId);

    if (pageData.error) {
        res.status(pageData.statusCode);
    }

    const html = createLayout(pageData.content, pageData.title);
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

// Start server
app.listen(PORT, () => {
    console.log(`📍 http://localhost:${PORT}`);
});