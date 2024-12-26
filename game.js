const readline = require('readline');

class NumberGuessingGame {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        this.difficulties = {
            '1': { name: 'Easy', chances: 10 },
            '2': { name: 'Medium', chances: 5 },
            '3': { name: 'Hard', chances: 3 }
        };

        this.highScores = {
            'Easy': Infinity,
            'Medium': Infinity,
            'Hard': Infinity
        };
    }

    async question(query) {
        return new Promise(resolve => this.rl.question(query, resolve));
    }

    displayWelcomeMessage() {
        console.log("\n=== Welcome to the Number Guessing Game! ===");
        console.log("Rules:");
        console.log("1. I'll think of a number between 1 and 100");
        console.log("2. You need to guess that number within the given chances");
        console.log("3. You'll get hints if the number is higher or lower");
        console.log("4. You have 2 special hints available per game");
        console.log("\nPlease select the difficulty level:");
        for (const [key, { name, chances }] of Object.entries(this.difficulties)) {
            console.log(`${key}. ${name} (${chances} chances)`);
        }
    }

    async getDifficulty() {
        while (true) {
            const choice = await this.question("\nEnter your choice (1-3): ");
            if (this.difficulties[choice]) {
                const { name, chances } = this.difficulties[choice];
                console.log(`\nGreat! You selected ${name} difficulty.`);
                console.log(`You have ${chances} chances to guess the number.`);
                return { name, chances };
            }
            console.log("Invalid choice. Please select 1, 2, or 3.");
        }
    }

    provideHint(target, guess, hintsRemaining) {
        if (hintsRemaining <= 0) {
            console.log("No hints remaining!");
            return hintsRemaining;
        }

        const difference = Math.abs(target - guess);
        if (difference > 40) {
            console.log("Hint: You're very far from the number!");
        } else if (difference > 20) {
            console.log("Hint: You're getting closer, but still quite far!");
        } else if (difference > 10) {
            console.log("Hint: You're getting warm!");
        } else {
            console.log("Hint: You're very close!");
        }

        return hintsRemaining - 1;
    }

    async playRound() {
        const targetNumber = Math.floor(Math.random() * 100) + 1;
        const { name: difficulty, chances: maxAttempts } = await this.getDifficulty();
        let attempts = 0;
        let hintsRemaining = 2;
        const startTime = Date.now();

        while (attempts < maxAttempts) {
            const guessStr = await this.question("\nEnter your guess (1-100): ");
            const guess = parseInt(guessStr);

            if (isNaN(guess) || guess < 1 || guess > 100) {
                console.log("Please enter a valid number between 1 and 100.");
                continue;
            }

            attempts++;

            if (guess === targetNumber) {
                const elapsedTime = (Date.now() - startTime) / 1000;
                console.log(`\nCongratulations! You guessed the correct number in ${attempts} attempts!`);
                console.log(`Time taken: ${elapsedTime.toFixed(2)} seconds`);

                if (attempts < this.highScores[difficulty]) {
                    this.highScores[difficulty] = attempts;
                    console.log(`New high score for ${difficulty} difficulty!`);
                }

                return { won: true, attempts, elapsedTime };
            }

            console.log(`Incorrect! The number is ${targetNumber > guess ? 'greater' : 'less'} than ${guess}.`);
            console.log(`Attempts remaining: ${maxAttempts - attempts}`);

            if (hintsRemaining > 0) {
                const wantHint = await this.question("Would you like a hint? (y/n): ");
                if (wantHint.toLowerCase() === 'y') {
                    hintsRemaining = this.provideHint(targetNumber, guess, hintsRemaining);
                }
            }
        }

        console.log(`\nGame Over! The number was ${targetNumber}`);
        return { won: false, attempts, elapsedTime: (Date.now() - startTime) / 1000 };
    }

    displayHighScores() {
        console.log("\n=== High Scores ===");
        for (const [difficulty, score] of Object.entries(this.highScores)) {
            const scoreDisplay = score === Infinity ? "No score yet" : `${score} attempts`;
            console.log(`${difficulty}: ${scoreDisplay}`);
        }
    }

    async playGame() {
        while (true) {
            this.displayWelcomeMessage();
            const { won, attempts, elapsedTime } = await this.playRound();
            this.displayHighScores();

            const playAgain = await this.question("\nWould you like to play again? (y/n): ");
            if (playAgain.toLowerCase() !== 'y') {
                console.log("\nThanks for playing! Goodbye!");
                this.rl.close();
                break;
            }
        }
    }
}

// Export the class for testing
module.exports = NumberGuessingGame;

// Only start the game if this file is run directly
if (require.main === module) {
    const game = new NumberGuessingGame();
    game.playGame();
}