const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, '../../data/products.json');

/**
 * Ladda produkter (Admin version!!!) med inaktiva
 * @returns {Array}
 */
function loadAllProducts() {
    try {
        const productsData = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
        const products = JSON.parse(productsData);

        return products.sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
        });
    } catch (error) {
        console.error('Admin - Fel vid laddning av produkter:', error);
        return [];
    }
}

/**
 * Spara Produkter (ADMIN only)
 * @param {Array} products
 * @returns {boolean}
 */

function saveProducts(products) {
    try {
        // JSONTOPRETTY
        const jsonData = JSON.stringify(products, null, 2);

        // Spara till filen
        fs.writeFileSync(PRODUCTS_FILE, jsonData, 'utf8');
        console.log('✅ Admin - Produkter sparade successfully');
        return true;
    } catch (error) {
        console.error('❌ Admin - Fel vid sparande av produkter:', error);
        return false;
    }
}

/**
 * Get next id 
 * @returns {number}
 */
function getNextId() {
    const products = loadAllProducts();
    if (products.length === 0) {
        return 1;
    }

    // Hitta högst + 1
    const maxId = Math.max(...products.map(p => p.id));
    return maxId + 1;
}

/**
 * Validera SKU
 * @param {string} sku 
 * @returns {boolean}
 */
function isValidSKUFormat(sku) {
    const skuPattern = /^[A-Z]{3}[0-9]{3}$/;
    return skuPattern.test(sku);
}


/**
 * Create Product
 * @param {Object} productData
 * @returns {Object} - antigen success status eller error
 */
function createProduct(productData) {
    try {
        const requiredFields = ['name', 'brand', 'price', 'sku'];
        const missingFields = requiredFields.filter(field => !productData[field]);

        // Hitta fält som saknsas
        if (missingFields.length > 0) {
            return {
                success: false,
                error: `Obligatoriska fält saknas: ${missingFields.join(', ')}`
            };
        }

        // Validdera SKU
        if (!isValidSKUFormat(productData.sku)) {
            return {
                success: false,
                error: `SKU måste vara i format ABC123 (3 bokstäver + 3 siffror). Exempel: LEV001, NIK123`
            };
        }


        const existingProducts = loadAllProducts();


        // Säkerställa att SKU är unique
        const skuExists = existingProducts.find(p => p.sku === productData.sku);
        if (skuExists) {
            return {
                success: false,
                error: `SKU "${productData.sku}" finns redan`
            };
        }


        // SKAPA EN OBJEKT MED NYA PRODUKTENS INFO
        const newProduct = {
            id: getNextId(),
            name: productData.name,
            brand: productData.brand,
            description: productData.description || '',
            price: parseFloat(productData.price),
            sku: productData.sku.toUpperCase(), // ← Ensure uppercase for consistency
            image_url: productData.image_url || '/images/placeholder.jpg',
            category: productData.category || 'general',
            stock_quantity: parseInt(productData.stock_quantity) || 0,
            is_active: productData.is_active !== false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        existingProducts.push(newProduct);
        const saveSuccess = saveProducts(existingProducts);

        if (saveSuccess) {
            console.log('✅ Admin - Ny produkt skapad:', newProduct.name);
            return {
                success: true,
                product: newProduct
            };
        } else {
            return {
                success: false,
                error: 'Kunde inte spara produkten'
            };
        }

    } catch (error) {
        console.error('❌ Admin - Fel vid skapande av produkt:', error);
        return {
            success: false,
            error: 'Serverfel vid skapande av produkt'
        };
    }
}

/**
 * Update Product
 * @param {number} productId 
 * @param {Object} updateData 
 * @returns {Object}
 */
function updateProduct(productId, updateData) {
    try {
        const allProducts = loadAllProducts();
        const productIndex = allProducts.findIndex(p => p.id === parseInt(productId));

        if (productIndex === -1) {
            return {
                success: false,
                error: `Produkt med ID ${productId} hittades inte`
            };
        }
        const existingProduct = allProducts[productIndex];

        // Validera SKU
        if (updateData.sku && updateData.sku !== existingProduct.sku) {
            // Check SKU format
            if (!isValidSKUFormat(updateData.sku)) {
                return {
                    success: false,
                    error: `SKU måste vara i format ABC123 (3 bokstäver + 3 siffror). Exempel: LEV001, NIK123`
                };
            }

            const skuExists = allProducts.find(p => 
                p.sku === updateData.sku && p.id !== parseInt(productId)
            );

            if (skuExists) {
                return {
                    success: false,
                    error: `SKU "${updateData.sku}" används redan av produkt: ${skuExists.name}`
                };
            }
        }

        // BARA UPDATERA ÄNDRADE FÄLT!!!
        const updatedProduct = {
            ...existingProduct,  
            ...(updateData.name && { name: updateData.name }),
            ...(updateData.brand && { brand: updateData.brand }),
            ...(updateData.description !== undefined && { description: updateData.description }),
            ...(updateData.price && { price: parseFloat(updateData.price) }),
            ...(updateData.sku && { sku: updateData.sku.toUpperCase() }),
            ...(updateData.image_url !== undefined && { image_url: updateData.image_url }),
            ...(updateData.category && { category: updateData.category }),
            ...(updateData.stock_quantity !== undefined && { 
                stock_quantity: parseInt(updateData.stock_quantity) || 0 
            }),
            ...(updateData.is_active !== undefined && { is_active: updateData.is_active }),
            
            // Always update the timestamp
            updated_at: new Date().toISOString()
        };

        allProducts[productIndex] = updatedProduct;
        const saveSuccess = saveProducts(allProducts);

        if (saveSuccess) {
            console.log('✅ Admin - Produkt uppdaterad:', updatedProduct.name);
            return {
                success: true,
                product: updatedProduct
            };
        } else {
            return {
                success: false,
                error: 'Kunde inte spara ändringar'
            };
        }
    } catch (error) {
        console.error('❌ Admin - Fel vid uppdatering av produkt:', error);
        return {
            success: false,
            error: 'Serverfel vid uppdatering av produkt'
        };
    }
}

/**
 * Delete Product (SET IS TO ACTIVE => FALSE) soft delete
 * @param {number} productId
 * @returns {Object} 
 */
function deleteProduct(productId) {
    try {
        const allProducts = loadAllProducts();
        const productIndex = allProducts.findIndex(p => p.id === parseInt(productId));

        if (productIndex === -1) {
            return {
                success: false,
                error: `Produkt med ID ${productId} hittades inte`
            };
        }

        const product = allProducts[productIndex];

        // SOFT DELETE - sätt is_active till false
        allProducts[productIndex] = {
            ...product,
            is_active: false,
            updated_at: new Date().toISOString()
        };

        const saveSuccess = saveProducts(allProducts);

        if (saveSuccess) {
            console.log('✅ Admin - Produkt inaktiverad:', product.name);
            return {
                success: true,
                message: `Produkt "${product.name}" har inaktiverats`
            };
        } else {
            return {
                success: false,
                error: 'Kunde inte spara ändringar'
            };
        }
    } catch (error) {
        console.error('❌ Admin - Fel vid borttagning av produkt:', error);
        return {
            success: false,
            error: 'Serverfel vid borttagning av produkt'
        };
    }
}

module.exports = {
    loadAllProducts,
    saveProducts,
    getNextId,
    createProduct,
    updateProduct,
    deleteProduct, 
    isValidSKUFormat
};