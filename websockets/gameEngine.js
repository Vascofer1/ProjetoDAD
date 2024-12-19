exports.createGameEngine = () => {
    const generateBoard = (rows, cols) => {
        const totalCards = rows * cols;
        if (totalCards % 2 !== 0) throw new Error("Board size must be even for pairs.");

        const pairs = Array.from({ length: totalCards / 2 }, (_, i) => i + 1); // [1, 2, ..., n]
        const allCards = [...pairs, ...pairs]; // Duplicate pairs
        
        // Shuffle the cards
        for (let i = allCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
        }
        
        return allCards.map(() => ({ value: 0, revealed: false, matched: false })); // Initialize board
    };

    const initGame = (gameFromDB, rows = 4, cols = 4) => {
        gameFromDB.gameStatus = null; // null -> not started, 0 -> running, 1 -> ended
        gameFromDB.rows = rows;
        gameFromDB.cols = cols;
        gameFromDB.currentPlayer = 1;
        gameFromDB.revealedCards = []; // Temporary store for revealed cards
        gameFromDB.board = generateBoard(rows, cols); // Board with shuffled cards
        return gameFromDB;
    };

    const isGameWon = (game) => game.board.every(card => card.matched);

    const changeGameStatus = (game) => {
        if (isGameWon(game)) {
            game.gameStatus = game.currentPlayer;
        } else {
            game.gameStatus = 0;
        }
    };

    const gameEnded = (game) => game.gameStatus === 1;

    const revealCard = (game, index) => {
        if (game.board[index].revealed || game.board[index].matched) {
            return {
                errorCode: 15,
                errorMessage: 'Card already revealed or matched!'
            };
        }
        game.board[index].revealed = true;
        game.revealedCards.push(index);
    };

    const play = (game, index, playerSocketId) => {
        if (!isPlayerInGame(game, playerSocketId)) {
            return {
                errorCode: 10,
                errorMessage: 'You are not playing this game!'
            };
        }

        if (gameEnded(game)) {
            return {
                errorCode: 11,
                errorMessage: 'Game has already ended!'
            };
        }

        if (game.revealedCards.length >= 2) {
            return {
                errorCode: 16,
                errorMessage: 'You cannot reveal more than 2 cards in a turn!'
            };
        }

        const revealResult = revealCard(game, index);
        if (revealResult) return revealResult;

        if (game.revealedCards.length === 2) {
            const [firstIndex, secondIndex] = game.revealedCards;
            const firstCard = game.board[firstIndex];
            const secondCard = game.board[secondIndex];

            if (firstCard.value === secondCard.value) {
                firstCard.matched = true;
                secondCard.matched = true;
            } else {
                firstCard.revealed = false;
                secondCard.revealed = false;
                game.currentPlayer = game.currentPlayer === 1 ? 2 : 1; // Switch player turn
            }
            game.revealedCards = [];
        }

        changeGameStatus(game);
        return true;
    };

    const quit = (game, playerSocketId) => {
        if (!isPlayerInGame(game, playerSocketId)) {
            return {
                errorCode: 10,
                errorMessage: 'You are not playing this game!'
            };
        }
        game.gameStatus = playerSocketId === game.player1SocketId ? 2 : 1; // Opponent wins
        return true;
    };

    const close = (game, playerSocketId) => {
        if (!isPlayerInGame(game, playerSocketId)) {
            return {
                errorCode: 10,
                errorMessage: 'You are not playing this game!'
            };
        }
        if (!gameEnded(game)) {
            return {
                errorCode: 14,
                errorMessage: 'Cannot close a game that has not ended!'
            };
        }
        return true;
    };

    const isPlayerInGame = (game, playerSocketId) => 
        playerSocketId === game.player1SocketId || playerSocketId === game.player2SocketId;

    return {
        initGame,
        gameEnded,
        play,
        quit,
        close
    };
};