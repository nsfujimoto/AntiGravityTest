const {
    TraxBoard,
    BMAX,
    CENTER,
    BLANK,
    VERTICAL_W,
    HORIZONTAL_W,
    UPPER_LEFT_W,
    LOWER_RIGHT_W,
    UPPER_RIGHT_W,
    LOWER_LEFT_W,
    WHITE,
    RED
} = require('./script');

describe('TraxBoard', () => {
    let board;

    beforeEach(() => {
        board = new TraxBoard();
    });

    test('initialization', () => {
        expect(board.board.length).toBe(BMAX);
        expect(board.board[0].length).toBe(BMAX);
        expect(board.minX).toBe(CENTER);
        expect(board.maxX).toBe(CENTER);
        expect(board.minY).toBe(CENTER);
        expect(board.maxY).toBe(CENTER);
    });

    test('placeTile updates board and boundaries', () => {
        board.placeTile(CENTER, CENTER, VERTICAL_W);
        expect(board.getTile(CENTER, CENTER)).toBe(VERTICAL_W);
        expect(board.minX).toBe(CENTER);
        expect(board.maxX).toBe(CENTER);
        expect(board.minY).toBe(CENTER);
        expect(board.maxY).toBe(CENTER);

        board.placeTile(CENTER + 1, CENTER, HORIZONTAL_W);
        expect(board.getTile(CENTER + 1, CENTER)).toBe(HORIZONTAL_W);
        expect(board.maxX).toBe(CENTER + 1);
    });

    test('canPlace checks color matching', () => {
        // Place a tile at center: Vertical White (Top/Bottom White, Left/Right Red)
        // VERTICAL_W = 1010 (UPPER | LOWER) -> White up/down, Red left/right
        board.placeTile(CENTER, CENTER, VERTICAL_W);

        // Try to place to the right (x+1)
        // The left of the new tile must match the right of the center tile.
        // Center tile right is RED.
        // So new tile left must be RED.

        // HORIZONTAL_W = 0101 (RIGHT | LEFT) -> White left/right. 
        // Left is White. Red != White. Should be false.
        expect(board.canPlace(CENTER + 1, CENTER, HORIZONTAL_W)).toBe(false);

        // UPPER_LEFT_W = 0110 (UPPER | LEFT) -> White up/left.
        // Left is White. Red != White. Should be false.
        expect(board.canPlace(CENTER + 1, CENTER, UPPER_LEFT_W)).toBe(false);

        // LOWER_RIGHT_W = 1001 (RIGHT | LOWER) -> White right/down.
        // Left is Red (implicit). Red == Red. Should be true.
        expect(board.canPlace(CENTER + 1, CENTER, LOWER_RIGHT_W)).toBe(true);
    });

    test('resolveForcedMoves places forced tiles', () => {
        // Setup a scenario where a forced move should happen.
        // Place two tiles that force a third one.
        // Example:
        //   A
        // B ?
        // If A has a path going down, and B has a path going right, and they are same color entering '?',
        // then '?' must connect them.

        // Center: Vertical White (White Up/Down)
        board.placeTile(CENTER, CENTER, VERTICAL_W);

        // Below Center: Vertical White (White Up/Down)
        // This connects to the bottom of Center.
        board.placeTile(CENTER, CENTER + 1, VERTICAL_W);

        // This is just a line, no forced move yet in empty space.

        // Let's try a corner case.
        //   |
        // --+
        //
        // (0,0) Vertical White (White Down)
        // (-1, 1) Horizontal White (White Right)
        // (0, 1) needs to connect White from Top and White from Left -> Upper Left White

        board = new TraxBoard();
        board.placeTile(CENTER, CENTER, VERTICAL_W); // White connects down
        board.placeTile(CENTER - 1, CENTER + 1, HORIZONTAL_W); // White connects right

        // The spot (CENTER, CENTER+1) has White coming from Top (from (CENTER,CENTER))
        // and White coming from Left (from (CENTER-1, CENTER+1)).
        // So it MUST be a tile that connects Top and Left with White.
        // That is UPPER_LEFT_W (UPPER | LEFT).

        const placed = board.resolveForcedMoves();
        expect(placed).toBe(true);
        expect(board.getTile(CENTER, CENTER + 1)).toBe(UPPER_LEFT_W);
    });

    test('isIllegalSpot detects 3 paths of same color', () => {
        // Force 3 white paths into a single cell
        //   |
        // --?--
        //
        // Top: Vertical White (White Down)
        // Left: Horizontal White (White Right)
        // Right: Horizontal White (White Left)

        board.placeTile(CENTER, CENTER - 1, VERTICAL_W);
        board.placeTile(CENTER - 1, CENTER, HORIZONTAL_W);
        board.placeTile(CENTER + 1, CENTER, HORIZONTAL_W);

        // Now (CENTER, CENTER) has White from Top, Left, Right.
        expect(board.isIllegalSpot(CENTER, CENTER)).toBe(true);
    });

    test('checkWin detects loop', () => {
        // Create a small loop of 4 tiles
        // TL TR
        // BL BR
        // TL: Lower Right White (1001) -> LOWER_RIGHT_W
        // TR: Lower Left White (1100) -> LOWER_LEFT_W
        // BL: Upper Right White (0011) -> UPPER_RIGHT_W
        // BR: Upper Left White (0110) -> UPPER_LEFT_W

        board.placeTile(CENTER, CENTER, LOWER_RIGHT_W);
        board.placeTile(CENTER + 1, CENTER, LOWER_LEFT_W);
        board.placeTile(CENTER, CENTER + 1, UPPER_RIGHT_W);
        board.placeTile(CENTER + 1, CENTER + 1, UPPER_LEFT_W);

        expect(board.checkWin(WHITE)).toBe(true);
        expect(board.checkWin(RED)).toBe(false);
    });
});
