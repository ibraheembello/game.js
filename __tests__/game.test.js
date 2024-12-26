const NumberGuessingGame = require('../game');

describe('NumberGuessingGame', () => {
    let game;

    beforeEach(() => {
        game = new NumberGuessingGame();
    });

    test('should initialize with correct default values', () => {
        expect(game.difficulties['1'].chances).toBe(10);
        expect(game.difficulties['2'].chances).toBe(5);
        expect(game.difficulties['3'].chances).toBe(3);
        expect(game.highScores.Easy).toBe(Infinity);
    });

    test('should provide appropriate hints', () => {
        const target = 50;
        const farGuess = 10;
        const closeGuess = 45;
        
        expect(game.provideHint(target, farGuess, 2)).toBe(1);
        expect(game.provideHint(target, closeGuess, 1)).toBe(0);
        expect(game.provideHint(target, closeGuess, 0)).toBe(0);
    });

    test('should handle invalid guesses', async () => {
        // Mock readline interface
        game.question = jest.fn()
            .mockResolvedValueOnce('invalid')
            .mockResolvedValueOnce('101')
            .mockResolvedValueOnce('50');
            
        const result = await game.playRound();
        expect(result).toBeDefined();
    });
});