const {
    TraxBoard,
    TraxAI,
    CENTER,
    VERTICAL_W,
    WHITE,
    RED
} = require('./script');

describe('TraxAI', () => {
    let ai;
    let board;

    beforeEach(() => {
        ai = new TraxAI();
        board = new TraxBoard();
    });

    test('getValidMoves returns moves for first turn', () => {
        const moves = ai.getValidMoves(board);
        // Should be 6 possible tiles at CENTER
        expect(moves.length).toBe(6);
        moves.forEach(move => {
            expect(move.x).toBe(CENTER);
            expect(move.y).toBe(CENTER);
        });
    });

    test('getValidMoves returns moves adjacent to existing tiles', () => {
        board.placeTile(CENTER, CENTER, VERTICAL_W);
        const moves = ai.getValidMoves(board);

        // Should have moves around the center tile
        // (CENTER, CENTER) is occupied.
        // Neighbors: (C, C-1), (C, C+1), (C-1, C), (C+1, C)
        // Each neighbor might have multiple valid tile orientations.
        expect(moves.length).toBeGreaterThan(0);

        moves.forEach(move => {
            // Should not be at center
            expect(move.x !== CENTER || move.y !== CENTER).toBe(true);
            // Should be adjacent
            const dx = Math.abs(move.x - CENTER);
            const dy = Math.abs(move.y - CENTER);
            expect(dx + dy).toBe(1);
        });
    });

    test('getBestMove returns a move', () => {
        // First move
        const move = ai.getBestMove(board, RED);
        expect(move).toBeDefined();
        expect(move.x).toBe(CENTER);
        expect(move.y).toBe(CENTER);
    });
});
