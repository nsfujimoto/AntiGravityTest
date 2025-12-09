const BMAX = 60;
const CENTER = Math.floor(BMAX / 2);
const CELL_SIZE = 40;

// Constants
const BLANK = 0x00;
const RIGHT = 0x01;
const UPPER = 0x02;
const LEFT = 0x04;
const LOWER = 0x08;

// Tiles (White path connections)
const VERTICAL_W = (UPPER | LOWER);    // 1010 = 10
const HORIZONTAL_W = (RIGHT | LEFT);   // 0101 = 5
const UPPER_LEFT_W = (UPPER | LEFT);   // 0110 = 6
const LOWER_RIGHT_W = (RIGHT | LOWER); // 1001 = 9
const UPPER_RIGHT_W = (RIGHT | UPPER); // 0011 = 3
const LOWER_LEFT_W = (LEFT | LOWER);   // 1100 = 12

const TILE_TYPES = [VERTICAL_W, HORIZONTAL_W, UPPER_LEFT_W, LOWER_RIGHT_W, UPPER_RIGHT_W, LOWER_LEFT_W];

// Colors
const RED = 1;
const WHITE = 2;

class TraxBoard {
    constructor() {
        this.board = Array(BMAX).fill().map(() => Array(BMAX).fill(BLANK));
        this.minX = CENTER;
        this.maxX = CENTER;
        this.minY = CENTER;
        this.maxY = CENTER;
    }

    clone() {
        const newBoard = new TraxBoard();
        newBoard.board = this.board.map(row => [...row]);
        newBoard.minX = this.minX;
        newBoard.maxX = this.maxX;
        newBoard.minY = this.minY;
        newBoard.maxY = this.maxY;
        return newBoard;
    }

    getTile(x, y) {
        if (x < 0 || x >= BMAX || y < 0 || y >= BMAX) return BLANK;
        return this.board[y][x];
    }

    placeTile(x, y, tile) {
        this.board[y][x] = tile;
        this.minX = Math.min(this.minX, x);
        this.maxX = Math.max(this.maxX, x);
        this.minY = Math.min(this.minY, y);
        this.maxY = Math.max(this.maxY, y);
    }

    hasNeighbors(x, y) {
        return (this.getTile(x + 1, y) !== BLANK ||
            this.getTile(x - 1, y) !== BLANK ||
            this.getTile(x, y + 1) !== BLANK ||
            this.getTile(x, y - 1) !== BLANK);
    }

    isFirstMove() {
        for (let y = 0; y < BMAX; y++) {
            for (let x = 0; x < BMAX; x++) {
                if (this.board[y][x] !== BLANK) return false;
            }
        }
        return true;
    }

    canPlace(x, y, tile) {
        // Check neighbors for color match
        const right = this.getTile(x + 1, y);
        if (right !== BLANK) {
            const myRight = (tile & RIGHT) ? WHITE : RED;
            const neighborLeft = (right & LEFT) ? WHITE : RED;
            if (myRight !== neighborLeft) return false;
        }

        const left = this.getTile(x - 1, y);
        if (left !== BLANK) {
            const myLeft = (tile & LEFT) ? WHITE : RED;
            const neighborRight = (left & RIGHT) ? WHITE : RED;
            if (myLeft !== neighborRight) return false;
        }

        const bottom = this.getTile(x, y + 1);
        if (bottom !== BLANK) {
            const myBottom = (tile & LOWER) ? WHITE : RED;
            const neighborTop = (bottom & UPPER) ? WHITE : RED;
            if (myBottom !== neighborTop) return false;
        }

        const top = this.getTile(x, y - 1);
        if (top !== BLANK) {
            const myTop = (tile & UPPER) ? WHITE : RED;
            const neighborBottom = (top & LOWER) ? WHITE : RED;
            if (myTop !== neighborBottom) return false;
        }

        return true;
    }

    getValidTiles(x, y) {
        const valid = [];
        for (let tile of TILE_TYPES) {
            if (this.canPlace(x, y, tile)) {
                valid.push(tile);
            }
        }
        return valid;
    }

    resolveForcedMoves() {
        let placed = true;
        while (placed) {
            placed = false;
            // Scan for illegal spots first
            for (let y = this.minY - 1; y <= this.maxY + 1; y++) {
                for (let x = this.minX - 1; x <= this.maxX + 1; x++) {
                    if (this.board[y][x] === BLANK) {
                        if (this.isIllegalSpot(x, y)) {
                            return false; // Illegal move detected
                        }
                    }
                }
            }

            // Then scan for forced moves
            for (let y = this.minY - 1; y <= this.maxY + 1; y++) {
                for (let x = this.minX - 1; x <= this.maxX + 1; x++) {
                    if (this.board[y][x] === BLANK) {
                        const forcedTile = this.getForcedTile(x, y);
                        if (forcedTile !== null) {
                            this.placeTile(x, y, forcedTile);
                            placed = true;
                        }
                    }
                }
            }
        }
        return true;
    }

    isIllegalSpot(x, y) {
        let whitePaths = 0;
        let redPaths = 0;

        const top = this.getTile(x, y - 1);
        if (top !== BLANK) { if (top & LOWER) whitePaths++; else redPaths++; }

        const bottom = this.getTile(x, y + 1);
        if (bottom !== BLANK) { if (bottom & UPPER) whitePaths++; else redPaths++; }

        const left = this.getTile(x - 1, y);
        if (left !== BLANK) { if (left & RIGHT) whitePaths++; else redPaths++; }

        const right = this.getTile(x + 1, y);
        if (right !== BLANK) { if (right & LEFT) whitePaths++; else redPaths++; }

        if (whitePaths > 2 || redPaths > 2) return true;
        return false;
    }

    getForcedTile(x, y) {
        let whitePaths = 0;
        let redPaths = 0;

        const top = this.getTile(x, y - 1);
        if (top !== BLANK) {
            if (top & LOWER) whitePaths |= UPPER; else redPaths |= UPPER;
        }

        const bottom = this.getTile(x, y + 1);
        if (bottom !== BLANK) {
            if (bottom & UPPER) whitePaths |= LOWER; else redPaths |= LOWER;
        }

        const left = this.getTile(x - 1, y);
        if (left !== BLANK) {
            if (left & RIGHT) whitePaths |= LEFT; else redPaths |= LEFT;
        }

        const right = this.getTile(x + 1, y);
        if (right !== BLANK) {
            if (right & LEFT) whitePaths |= RIGHT; else redPaths |= RIGHT;
        }

        const countBits = (n) => {
            let count = 0;
            while (n > 0) {
                if (n & 1) count++;
                n >>= 1;
            }
            return count;
        };

        if (countBits(whitePaths) >= 2) return whitePaths;
        if (countBits(redPaths) >= 2) return (~redPaths) & 0x0F;

        return null;
    }

    checkWin(color) {
        const visited = new Set();
        for (let y = this.minY; y <= this.maxY; y++) {
            for (let x = this.minX; x <= this.maxX; x++) {
                if (this.board[y][x] === BLANK) continue;
                const dirs = [UPPER, RIGHT, LOWER, LEFT];
                for (let dir of dirs) {
                    const key = `${x},${y},${dir}`;
                    if (visited.has(key)) continue;
                    if (this.tracePath(x, y, dir, color, visited)) return true;
                }
            }
        }
        return false;
    }

    tracePath(startX, startY, startDir, color, visited) {
        let x = startX;
        let y = startY;
        let currDir = startDir;
        let steps = 0;

        const tile = this.board[y][x];
        const isWhite = (tile & currDir) !== 0;
        if ((color === WHITE && !isWhite) || (color === RED && isWhite)) return false;

        let minX = x, maxX = x, minY = y, maxY = y;

        while (true) {
            const key = `${x},${y},${currDir}`;
            if (visited.has(key)) {
                if (x === startX && y === startY && currDir === startDir && steps > 2) return true;
                return false;
            }
            visited.add(key);
            steps++;

            let nextX = x, nextY = y;
            let fromDir;

            if (currDir === UPPER) { nextY--; fromDir = LOWER; }
            else if (currDir === RIGHT) { nextX++; fromDir = LEFT; }
            else if (currDir === LOWER) { nextY++; fromDir = UPPER; }
            else if (currDir === LEFT) { nextX--; fromDir = RIGHT; }

            if (nextX < 0 || nextX >= BMAX || nextY < 0 || nextY >= BMAX) break;
            const nextTile = this.board[nextY][nextX];
            if (nextTile === BLANK) break;

            minX = Math.min(minX, nextX);
            maxX = Math.max(maxX, nextX);
            minY = Math.min(minY, nextY);
            maxY = Math.max(maxY, nextY);

            const isNextWhite = (nextTile & fromDir) !== 0;
            if ((color === WHITE && !isNextWhite) || (color === RED && isNextWhite)) break;

            let exitDir;
            if (color === WHITE) {
                exitDir = nextTile ^ fromDir;
            } else {
                exitDir = ((~nextTile) & 0x0F) ^ fromDir;
            }

            x = nextX;
            y = nextY;
            currDir = exitDir;

            if (x === startX && y === startY && currDir === startDir) return true;
        }

        if ((maxX - minX + 1) >= 8 || (maxY - minY + 1) >= 8) return true;
        return false;
    }
}

class TraxAI {
    constructor() {
        this.maxDepth = 2; // Keep it shallow for JS performance
    }

    getBestMove(board, color) {
        let bestMove = null;
        let bestScore = -Infinity;
        const moves = this.getValidMoves(board);

        // Simple ordering: try center moves first? Or random shuffle to add variety
        moves.sort(() => Math.random() - 0.5);

        for (let move of moves) {
            const newBoard = board.clone();
            newBoard.placeTile(move.x, move.y, move.tile);
            if (!newBoard.resolveForcedMoves()) continue; // Illegal move

            // Check immediate win
            if (newBoard.checkWin(color)) return move;

            const score = this.minimax(newBoard, this.maxDepth, -Infinity, Infinity, false, color);
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
        return bestMove || moves[0];
    }

    minimax(board, depth, alpha, beta, isMaximizing, myColor) {
        if (board.checkWin(myColor)) return 10000 + depth;
        if (board.checkWin(myColor === WHITE ? RED : WHITE)) return -10000 - depth;
        if (depth === 0) return this.evaluate(board, myColor);

        const moves = this.getValidMoves(board);
        if (moves.length === 0) return 0; // Draw?

        if (isMaximizing) {
            let maxEval = -Infinity;
            for (let move of moves) {
                const newBoard = board.clone();
                newBoard.placeTile(move.x, move.y, move.tile);
                if (!newBoard.resolveForcedMoves()) continue;

                const score = this.minimax(newBoard, depth - 1, alpha, beta, false, myColor);
                maxEval = Math.max(maxEval, score);
                alpha = Math.max(alpha, score);
                if (beta <= alpha) break;
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (let move of moves) {
                const newBoard = board.clone();
                newBoard.placeTile(move.x, move.y, move.tile);
                if (!newBoard.resolveForcedMoves()) continue;

                const score = this.minimax(newBoard, depth - 1, alpha, beta, true, myColor);
                minEval = Math.min(minEval, score);
                beta = Math.min(beta, score);
                if (beta <= alpha) break;
            }
            return minEval;
        }
    }

    evaluate(board, color) {
        // Simple heuristic: random + some preference?
        // Maybe prefer moves that create threats?
        // For now, just return 0 to rely on win/loss search
        return 0;
    }

    getValidMoves(board) {
        const moves = [];
        // Optimization: only check empty cells adjacent to existing tiles
        // Or if first move, just center
        if (board.isFirstMove()) {
            for (let t of TILE_TYPES) {
                moves.push({ x: CENTER, y: CENTER, tile: t });
            }
            return moves;
        }

        const checked = new Set();
        const range = 1;
        for (let y = board.minY - range; y <= board.maxY + range; y++) {
            for (let x = board.minX - range; x <= board.maxX + range; x++) {
                if (board.getTile(x, y) === BLANK && board.hasNeighbors(x, y)) {
                    for (let t of TILE_TYPES) {
                        if (board.canPlace(x, y, t)) {
                            moves.push({ x, y, tile: t });
                        }
                    }
                }
            }
        }
        return moves;
    }
}

class TraxGame {
    constructor() {
        this.traxBoard = new TraxBoard();
        this.ai = new TraxAI();
        this.currentPlayer = WHITE;
        this.gameOver = false;
        this.moveHistory = [];
        this.aiEnabled = false;
        this.aiColor = RED; // AI plays Red by default if enabled

        this.initUI();
        this.render();
    }

    initUI() {
        this.boardElement = document.getElementById('board');
        this.boardElement.style.gridTemplateColumns = `repeat(${BMAX}, ${CELL_SIZE}px)`;
        this.boardElement.style.gridTemplateRows = `repeat(${BMAX}, ${CELL_SIZE}px)`;

        for (let y = 0; y < BMAX; y++) {
            for (let x = 0; x < BMAX; x++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.x = x;
                cell.dataset.y = y;
                cell.onclick = () => this.handleCellClick(x, y);
                this.boardElement.appendChild(cell);
            }
        }

        const container = document.getElementById('board-container');
        container.scrollTop = (CENTER * CELL_SIZE) - (container.clientHeight / 2);
        container.scrollLeft = (CENTER * CELL_SIZE) - (container.clientWidth / 2);

        document.getElementById('reset-btn').onclick = () => this.reset();

        const aiBtn = document.getElementById('ai-btn');
        aiBtn.onclick = () => {
            this.aiEnabled = !this.aiEnabled;
            aiBtn.textContent = `Play vs AI: ${this.aiEnabled ? 'ON' : 'OFF'}`;
            if (this.aiEnabled && this.currentPlayer === this.aiColor && !this.gameOver) {
                this.makeAIMove();
            }
        };
    }

    reset() {
        this.traxBoard = new TraxBoard();
        this.currentPlayer = WHITE;
        this.gameOver = false;
        this.moveHistory = [];
        this.updateStatus();

        for (let y = 0; y < BMAX; y++) {
            for (let x = 0; x < BMAX; x++) {
                this.renderCell(x, y);
            }
        }

        if (this.aiEnabled && this.currentPlayer === this.aiColor) {
            this.makeAIMove();
        }
    }

    updateStatus() {
        const statusEl = document.getElementById('current-player');
        statusEl.textContent = this.currentPlayer === WHITE ? "White" : "Red";
        statusEl.className = this.currentPlayer === WHITE ? "white" : "red";
    }

    handleCellClick(x, y) {
        if (this.gameOver) return;
        if (this.aiEnabled && this.currentPlayer === this.aiColor) return; // Not human turn

        if (this.traxBoard.getTile(x, y) !== BLANK) return;

        if (!this.traxBoard.isFirstMove() && !this.traxBoard.hasNeighbors(x, y)) return;

        this.showTileSelector(x, y);
    }

    showTileSelector(x, y) {
        const existing = document.getElementById('tile-popup');
        if (existing) existing.remove();

        const popup = document.createElement('div');
        popup.id = 'tile-popup';

        const validTiles = this.traxBoard.getValidTiles(x, y);

        if (validTiles.length === 0) return;

        validTiles.forEach(tileType => {
            const option = document.createElement('div');
            option.className = 'popup-option';
            option.innerHTML = this.getTileSVG(tileType);
            option.onclick = (e) => {
                e.stopPropagation();
                this.attemptMove(x, y, tileType);
                popup.remove();
            };
            popup.appendChild(option);
        });

        const cell = this.boardElement.children[y * BMAX + x];
        popup.style.left = (cell.offsetLeft + CELL_SIZE) + 'px';
        popup.style.top = cell.offsetTop + 'px';

        this.boardElement.appendChild(popup);

        const closeHandler = (e) => {
            if (!popup.contains(e.target)) {
                popup.remove();
                document.removeEventListener('click', closeHandler);
            }
        };
        setTimeout(() => document.addEventListener('click', closeHandler), 0);
    }

    attemptMove(x, y, tile) {
        const boardBackup = this.traxBoard.clone();

        try {
            this.traxBoard.placeTile(x, y, tile);

            if (!this.traxBoard.resolveForcedMoves()) {
                throw new Error("Illegal move resulted from forced moves");
            }

            this.render(); // Render move immediately

            if (this.traxBoard.checkWin(WHITE)) {
                setTimeout(() => alert("White Wins!"), 10);
                this.gameOver = true;
            } else if (this.traxBoard.checkWin(RED)) {
                setTimeout(() => alert("Red Wins!"), 10);
                this.gameOver = true;
            } else {
                this.currentPlayer = this.currentPlayer === WHITE ? RED : WHITE;
                this.updateStatus();

                if (this.aiEnabled && this.currentPlayer === this.aiColor && !this.gameOver) {
                    setTimeout(() => this.makeAIMove(), 100);
                }
            }

        } catch (e) {
            console.log("Move rejected: " + e.message);
            this.traxBoard = boardBackup;
            if (!this.aiEnabled || this.currentPlayer !== this.aiColor) {
                alert("Illegal Move: " + e.message);
            }
            this.render();
        }
    }

    makeAIMove() {
        if (this.gameOver) return;

        const aiStatus = document.getElementById('ai-status');
        aiStatus.style.display = 'block';

        // Use setTimeout to allow UI to update "Thinking..."
        setTimeout(() => {
            const move = this.ai.getBestMove(this.traxBoard, this.aiColor);
            aiStatus.style.display = 'none';
            if (move) {
                this.attemptMove(move.x, move.y, move.tile);
            } else {
                console.log("AI has no moves!");
            }
        }, 50);
    }

    render() {
        const renderMinX = Math.max(0, this.traxBoard.minX - 1);
        const renderMaxX = Math.min(BMAX - 1, this.traxBoard.maxX + 1);
        const renderMinY = Math.max(0, this.traxBoard.minY - 1);
        const renderMaxY = Math.min(BMAX - 1, this.traxBoard.maxY + 1);

        for (let y = renderMinY; y <= renderMaxY; y++) {
            for (let x = renderMinX; x <= renderMaxX; x++) {
                this.renderCell(x, y);
            }
        }
    }

    renderCell(x, y) {
        const cell = this.boardElement.children[y * BMAX + x];
        const tile = this.traxBoard.getTile(x, y);

        if (tile === BLANK) {
            cell.innerHTML = '';
            if (this.traxBoard.hasNeighbors(x, y) || (this.traxBoard.isFirstMove() && x === CENTER && y === CENTER)) {
                cell.classList.add('valid-move');
            } else {
                cell.classList.remove('valid-move');
            }
        } else {
            cell.innerHTML = this.getTileSVG(tile);
            cell.classList.remove('valid-move');
        }
    }

    getTileSVG(tile) {
        const getPoints = (dir) => {
            switch (dir) {
                case UPPER: return '20,0';
                case RIGHT: return '40,20';
                case LOWER: return '20,40';
                case LEFT: return '0,20';
            }
        };

        const getControl = (d1, d2) => {
            if ((d1 === UPPER && d2 === LOWER) || (d1 === LOWER && d2 === UPPER)) return null;
            if ((d1 === LEFT && d2 === RIGHT) || (d1 === RIGHT && d2 === LEFT)) return null;
            return '20,20';
        };

        const drawPath = (mask, colorClass) => {
            let d1 = 0, d2 = 0;
            if (mask & UPPER) d1 = UPPER;
            if (mask & RIGHT) { if (d1 === 0) d1 = RIGHT; else d2 = RIGHT; }
            if (mask & LOWER) { if (d1 === 0) d1 = LOWER; else d2 = LOWER; }
            if (mask & LEFT) { if (d1 === 0) d1 = LEFT; else d2 = LEFT; }

            const p1 = getPoints(d1);
            const p2 = getPoints(d2);
            const cp = getControl(d1, d2);

            if (cp) {
                return `<path d="M ${p1} Q ${cp} ${p2}" class="${colorClass}" />`;
            } else {
                return `<path d="M ${p1} L ${p2}" class="${colorClass}" />`;
            }
        };

        const whitePath = drawPath(tile, 'path-white');
        const redPath = drawPath((~tile) & 0x0F, 'path-red');

        return `<svg viewBox="0 0 40 40">${redPath}${whitePath}</svg>`;
    }
}

if (typeof window !== 'undefined') {
    window.onload = () => {
        const game = new TraxGame();
    };
}

if (typeof module !== 'undefined') {
    module.exports = {
        TraxBoard,
        TraxAI,
        TraxGame,
        BMAX,
        CENTER,
        CELL_SIZE,
        BLANK,
        RIGHT,
        UPPER,
        LEFT,
        LOWER,
        VERTICAL_W,
        HORIZONTAL_W,
        UPPER_LEFT_W,
        LOWER_RIGHT_W,
        UPPER_RIGHT_W,
        LOWER_LEFT_W,
        TILE_TYPES,
        RED,
        WHITE
    };
}
