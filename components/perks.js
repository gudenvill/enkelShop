/**
 * genererar perks section component
 * @returns {string} HTML perks section content
 */
function createPerks() {
    return `
        <div class="perks-wrapper">
            <div class="perk-item">
                <div class="perk-icon">
                    <i class="fa-solid fa-earth-americas"></i>
                </div>
                <div class="perk-text">
                    Gratis frakt och returer
                </div>
            </div>
            
            <div class="perk-item">
                <div class="perk-icon">
                    <i class="fa-solid fa-truck-fast"></i>
                </div>
                <div class="perk-text">
                    Expressfrakt
                </div>
            </div>
            
            <div class="perk-item">
                <div class="perk-icon">
                    <i class="fa-solid fa-shield"></i>
                </div>
                <div class="perk-text">
                    Säkra betalningar
                </div>
            </div>
            
            <div class="perk-item">
                <div class="perk-icon">
                    <i class="fa-solid fa-face-smile"></i>
                </div>
                <div class="perk-text">
                    Nyheter varje dag
                </div>
            </div>
        </div>
    `;
}

module.exports = { createPerks };