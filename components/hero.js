/**
 * genererar hero section component
 * @returns {string} HTML hero section content
 */
function createHero() {
    return `
        <div class="hero">
            <div class="hero-image">
                <img src="/images/placeholder-hero.jpg" alt="Hero image">
            </div>
            
            <div class="hero-text">
                <h2>Välkommen till EnkelShop</h2>
                <p>Upptäck vårt omfattande sortiment av kvalitetsprodukter till fantastiska priser.</p>
            </div>
        </div>
    `;
}

module.exports = { createHero };