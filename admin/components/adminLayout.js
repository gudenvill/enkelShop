const { createHtmlHead } = require('../../components/htmlHead');
const { createAdminNav } = require('./adminNav');

/**
 * @param {string} content - 
 * @param {string} title -
 * @returns {string}
 */
function createAdminLayout(content, title = 'Dashboard') {
    const fullTitle = `Admin - ${title} | EnkelShop`;
    
    return `
        <!DOCTYPE html>
        <html lang="sv">
        <head>
            ${createHtmlHead(fullTitle)}
        </head>
        <body class="admin-body">
            <div class="admin-header">
                <div class="admin-container">
                    <h1 class="admin-title">🛠️ EnkelShop Admin</h1>
                </div>
            </div>
            
            <div class="admin-container">
                ${createAdminNav()}
                
                <div class="admin-content">
                    ${content}
                </div>
            </div>
        </body>
        </html>
    `;
}

module.exports = { createAdminLayout };