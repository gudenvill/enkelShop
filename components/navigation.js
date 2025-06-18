/**
 * genererar navigation componnt
 * @returns {string} HTML navigation content
 */
function createNavigation() {
    return `
        <ul class="navigation-list">
            <li>Nyheter</li>
            <li>Bästsäljare</li>
            <li>Kvinnor</li>
            <li>Män</li>
        </ul>
    `;
}

module.exports = { createNavigation };