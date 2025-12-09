# Trax Web

This is a web-based implementation of the Trax strategy game, ported from the C# version.
It includes an AI opponent implemented in JavaScript.

## How to Play

1. Open `index.html` in a modern web browser.
2. **White** moves first.
3. Click on an empty cell to place a tile.
   - On the first turn, you can click anywhere (usually the center).
   - On subsequent turns, you must place a tile adjacent to an existing tile.
4. Select the tile orientation from the popup menu.
5. **Forced Moves**: If a move creates a connection where two paths of the same color enter a single empty cell, a tile is automatically placed to connect them. This can trigger a chain reaction.
6. **Illegal Moves**: If a move (or resulting forced move) creates a situation where 3 or more paths of the same color enter a single cell, the move is illegal and cannot be played.
7. **Winning**:
   - Create a closed loop of your color.
   - Create a continuous line of your color that spans at least 8 rows or columns.

## AI Opponent (TraxAI)

You can play against a computer opponent. The AI uses a MiniMax algorithm with alpha-beta pruning to decide its moves.
Enable the AI from the UI to start playing against it.

## Development

The project is built with standard web technologies (HTML, CSS, JS) and uses **Jest** and **Playwright** for testing.

### Project Structure

- `index.html`: Main entry point.
- `style.css`: Styles for the board and tiles.
- `script.js`: Game logic, rendering, and AI implementation.
- `TraxAI.test.js`: Unit tests for AI logic.
- `TraxBoard.test.js`: Unit tests for board logic.
- `e2e/`: End-to-end tests using Playwright.

### Setup and Testing

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run unit tests (Jest):
   ```bash
   npm test
   ```

3. Run E2E tests (Playwright):
   ```bash
   npm run test:e2e
   ```

## Rules

See [Trax Rules](https://en.wikipedia.org/wiki/Trax_(game)) for more details.
