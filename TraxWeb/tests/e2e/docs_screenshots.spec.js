const { test, expect } = require('@playwright/test');

test.describe('Documentation Screenshots', () => {
    test('capture screenshots', async ({ page }) => {
        // Go to the local server
        await page.goto('http://localhost:8080');

        // Ensure the board is loaded
        const cells = page.locator('.cell');
        await expect(cells.first()).toBeVisible();

        // SCROLL TO CENTER
        // Board is 60x60 cells of 40px => 2400x2400. Center is at 1200,1200.
        // Viewport is smaller.
        // Scroll #board-container.
        await page.evaluate(() => {
            const container = document.getElementById('board-container');
            if (container) {
                container.scrollTop = 1000;
                container.scrollLeft = 1000;
            }
        });

        await page.waitForTimeout(500); // Wait in case of rendering lag

        // 1. Initial State (Centered)
        await page.screenshot({ path: 'docs/images/initial_board.png' });

        // 2. AI Controls
        const aiBtn = page.locator('#ai-btn');
        await expect(aiBtn).toBeVisible();
        await aiBtn.click(); // Enable AI
        await page.waitForTimeout(200);
        await page.screenshot({ path: 'docs/images/ai_controls.png' });
        await aiBtn.click(); // Disable AI

        // 3. Tile Selection
        // Click the center cell (30,30). Index = 30*60 + 30 = 1830.
        const centerIndex = 1830;

        // We already scrolled nearby. It should be visible.
        // Force click just in case
        await cells.nth(centerIndex).click({ force: true });

        // Wait for tile popup
        const popup = page.locator('#tile-popup');
        await expect(popup).toBeVisible();
        await page.waitForTimeout(500);

        await page.screenshot({ path: 'docs/images/tile_selection.png' });
    });
});
