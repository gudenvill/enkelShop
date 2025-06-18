const { createHtmlHead } = require('./htmlHead');
const { createHeader } = require('./header');
const { createNavigation } = require('./navigation');
const { createPerks } = require('./perks');
const { createFooter } = require('./footer');

/**
 * genererar hela HTML layout
 * @param {string} content - Main content HTML
 * @param {string} title - Page title
 * @returns {string} Complete HTML page
 */
function createLayout(content, title = 'EnkelShop') {
    return `
        <!DOCTYPE html>
        <html lang="sv">
        <head>
            ${createHtmlHead(title)}
        </head>
        <body>
            <div class="wrapper">
                ${createHeader()}
                ${createNavigation()}
                
                <main>
                    ${content}
                </main>
                
                ${createPerks()}
                ${createFooter()}
            </div>
        </body>
        </html>
    `;
}

module.exports = { createLayout };