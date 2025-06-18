const { isProductNew, getStockStatus, formatPrice } = require('../utils/productUtils');

/**
 * Skapa detaljvy för en enskild produkt
 * @param {Object} product - Produktdata från JSON
 * @returns {string} HTML för produktdetaljsida
 */
function createProductDetail(product) {
    // Använd importerade hjälpfunctioner
    const isNew = isProductNew(product.created_at);
    const stockStatus = getStockStatus(product.stock_quantity);
    const formattedPrice = formatPrice(product.price);

    return `
        <div class="product-detail-container">
            <nav class="breadcrumb">
                <a href="/">Hem</a> > <span>Produkter</span> > <span>${product.name}</span>
            </nav>
            
            <div class="product-detail">
                <div class="product-detail-image">
                    <img src="${product.image_url}" alt="${product.name}" width="400">
                    ${isNew ? '<div class="detail-new-badge">Nyhet!</div>' : ''}
                </div>
                
                <div class="product-detail-info">
                    <h1>${product.name}</h1>
                    <p class="product-brand">Märke: <strong>${product.brand}</strong></p>
                    <p class="product-sku">Artikelnummer: ${product.sku}</p>
                    
                    <div class="product-price">
                        <span class="price-amount">${formattedPrice}</span>
                    </div>
                    
                    <div class="product-description">
                        <h3>Produktbeskrivning</h3>
                        <p>${product.description}</p>
                    </div>
                    
                    <div class="product-stock">
                        <p class="stock-status ${stockStatus.class}">
                            <strong>${stockStatus.text}</strong>
                        </p>
                        <p class="stock-quantity">Antal i lager: ${product.stock_quantity}</p>
                    </div>
                    
                    <div class="product-actions">
                        ${product.stock_quantity === 0 ? 
                            '<button class="add-to-cart-btn" disabled>Slutsåld</button>' 
                            : 
                            `<form action="/cart/add" method="POST" style="display: inline;">
                                <input type="hidden" name="productId" value="${product.id}">
                                <div class="quantity-selector">
                                    <label for="quantity">Antal:</label>
                                    <input type="number" name="quantity" id="quantity" value="1" min="1" max="${product.stock_quantity}">
                                </div>
                                <button type="submit" class="add-to-cart-btn">Lägg i varukorg</button>
                            </form>`
                        }
                        <button class="wishlist-btn">
                            ♡ Lägg till önskelista
                        </button>
                    </div>
                    
                    <div class="product-category">
                        <p>Kategori: <strong>${product.category}</strong></p>
                    </div>
                </div>
            </div>
            
            <div class="back-to-products">
                <a href="/">&larr; Tillbaka till alla produkter</a>
            </div>
        </div>
    `;
}

module.exports = { createProductDetail };
