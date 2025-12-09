# Trax Web

This is a web-based implementation of the Trax strategy game, ported from the C# version.

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

## Development
- `index.html`: Main entry point.
- `style.css`: Styles for the board and tiles.
- `script.js`: Game logic and rendering.

## Rules
See [Trax Rules](https://en.wikipedia.org/wiki/Trax_(game)) for more details.
