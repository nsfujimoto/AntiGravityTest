const { test, expect } = require('@playwright/test');

test.describe('TraxWeb Gameplay', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('UI-01: Initial State', async ({ page }) => {
        await expect(page.locator('#board')).toBeVisible();
        await expect(page.locator('#current-player')).toHaveText('White');
        await expect(page.locator('#ai-btn')).toHaveText('Play vs AI: OFF');
        await page.screenshot({ path: 'screenshots/UI-01_Initial_State.png' });
    });

    test('UI-02: First Move (White)', async ({ page }) => {
        // Click center cell (30, 30)
        // Assuming 60x60 grid, center is roughly 30,30.
        // We need to find the cell element.
        // The cells have data-x and data-y attributes.
        const centerCell = page.locator('.cell[data-x="30"][data-y="30"]');
        await centerCell.click();

        // Popup should appear
        const popup = page.locator('#tile-popup');
        await expect(popup).toBeVisible();

        // Select first option
        await popup.locator('.popup-option').first().click();

        // Tile should be placed (svg inside cell)
        await expect(centerCell.locator('svg')).toBeVisible();

        // Status changes to Red
        await expect(page.locator('#current-player')).toHaveText('Red');
        await page.screenshot({ path: 'screenshots/UI-02_First_Move_White.png' });
    });

    test('UI-03: Second Move (Red)', async ({ page }) => {
        // First move
        const centerCell = page.locator('.cell[data-x="30"][data-y="30"]');
        await centerCell.click();
        await page.locator('.popup-option').first().click();

        // Second move (Red) - Adjacent cell (31, 30)
        const adjacentCell = page.locator('.cell[data-x="31"][data-y="30"]');
        await adjacentCell.click();

        // Popup should appear
        await expect(page.locator('#tile-popup')).toBeVisible();

        // Select option
        await page.locator('.popup-option').first().click();

        // Status changes to White
        await expect(page.locator('#current-player')).toHaveText('White');
        await page.screenshot({ path: 'screenshots/UI-03_Second_Move_Red.png' });
    });

    test('UI-04: Invalid Placement (Non-adjacent)', async ({ page }) => {
        // First move
        const centerCell = page.locator('.cell[data-x="30"][data-y="30"]');
        await centerCell.click();
        await page.locator('.popup-option').first().click();

        // Try to click a non-adjacent cell that is close enough to be in viewport
        // Center is 30,30. Adjacent are 29,30; 31,30; 30,29; 30,31.
        // (28, 30) is not adjacent but close.
        const farCell = page.locator('.cell[data-x="28"][data-y="30"]');
        await farCell.click();

        // Popup should NOT appear
        await expect(page.locator('#tile-popup')).not.toBeVisible();
        await page.screenshot({ path: 'screenshots/UI-04_Invalid_Placement.png' });
    });

    test('UI-10: Reset Game', async ({ page }) => {
        // Make a move
        const centerCell = page.locator('.cell[data-x="30"][data-y="30"]');
        await centerCell.click();
        await page.locator('.popup-option').first().click();

        // Click Reset
        await page.locator('#reset-btn').click();

        // Board should be empty (no svgs)
        const svgs = page.locator('.cell svg');
        await expect(svgs).toHaveCount(0);

        // Status should be White
        await expect(page.locator('#current-player')).toHaveText('White');
        await page.screenshot({ path: 'screenshots/UI-10_Reset_Game.png' });
    });

    test('UI-11: AI Toggle', async ({ page }) => {
        const aiBtn = page.locator('#ai-btn');
        await aiBtn.click();
        await expect(aiBtn).toHaveText('Play vs AI: ON');

        await aiBtn.click();
        await expect(aiBtn).toHaveText('Play vs AI: OFF');
        await page.screenshot({ path: 'screenshots/UI-11_AI_Toggle_OFF.png' });
    });
});
