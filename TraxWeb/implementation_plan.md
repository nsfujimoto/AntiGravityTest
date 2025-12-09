# Trax Web Implementation Plan

## Goal
Port the C# Trax application to a web-based version using HTML, CSS, and JavaScript. The app will run in the browser and replicate the core gameplay mechanics.

## User Review Required
- **Board Size**: I will use a fixed 60x60 grid (larger than the C# 27x27) to accommodate gameplay.
- **Graphics**: I will use inline SVGs for tiles instead of the original PNG images for better scalability and simplicity.
- **AI**: The initial version will be Player vs Player (Hotseat). AI can be added later if requested.

## Proposed Changes

### Directory: `TraxWeb/`

#### [NEW] `index.html`
- Main container for the game.
- Canvas or Grid-based board display.
- UI controls (New Game, Turn indicator).

#### [NEW] `style.css`
- Styling for the board, tiles, and UI.
- Responsive design to fit in the browser window.

#### [NEW] `script.js`
- **Game State**:
    - `board`: 2D array storing tile types.
    - `currentPlayer`: 'white' or 'red'.
    - `bounds`: Track min/max X/Y to optimize rendering.
- **Logic**:
    - `canPlace(x, y, tile)`: Validate move.
    - `place(x, y, tile)`: Execute move and trigger `resolveForcedMoves()`.
    - `resolveForcedMoves()`: Recursively place tiles. **CRITICAL**: Check for "Illegal Moves" (3 paths of same color entering a cell). If found, the move is invalid and must be rejected.
    - `checkWin()`: Detect loops and lines. Line win: Path spans >= 8 rows/cols.
- **Validation**:
    - **Illegal Move**: If a move results in a cell having 3+ connections of the same color, it is illegal.
    - **Forced Move**: Must be automatic.
- **Rendering**:
    - Draw grid and tiles dynamically.
    - Handle user input (click to place).

## Verification Plan
### Automated Tests
- None planned for this phase.

### Manual Verification
1.  **Basic Moves**: Verify placing tiles works and colors match.
2.  **Forced Moves**: Create a situation where a forced move should happen and verify it triggers automatically.
3.  **Win Condition**:
    - Create a small loop -> Verify win.
    - Create a line of length 8 -> Verify win.
