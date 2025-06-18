const { createCartCounter } = require('./cartCounter');

/**
 * genererar header component
 * @param {Object} session - Express session för cart data
 * @returns {string} HTML header content
 */
function createHeader(session = {}) {
    return `
        <header class="header">
            <div class="logotype">
                <h1><a href="/" style="text-decoration: none; color: inherit;">EnkelShop</a></h1>
            </div>
            
            <div class="actions">
                <div class="search-bar">
                    <form action="/" method="GET" style="display: flex; align-items: center;">
                        <input class="input" type="text" name="q" placeholder="Sök produkter...">
                        <button type="submit" aria-label="Search"> 
                            <i class="fas fa-search"></i>
                        </button>
                    </form>
                </div>
                
                <div class="action-buttons">
                    <a href="#" aria-label="Wishlist"> 
                        <i class="fas fa-heart"></i>
                    </a>
                    ${createCartCounter(session)}
                </div>
            </div>
        </header>
    `;
}

module.exports = { createHeader };