// ╔═════════════════════════════════╗
// ║            SLOT MACHINE         ║
// ║         ________________        ║
// ║   [  |  7  |  BAR |  🍒 |  ]    ║
// ║   [  |$$$$$|$$$$$$|$$$$$|  ]    ║
// ║   [  |_____|______|_____|  ]    ║
// ║         ________________        ║
// ║   [  | 🍒 |  🍊  |  🍇  |  ]    ║
// ║   [  |$$$$$|$$$$$$|$$$$$|  ]    ║
// ║   [  |_____|______|_____|  ]    ║
// ║         ________________        ║
// ║   [  | 🍇  |  🍒  |  🍊 |  ]    ║
// ║   [  |$$$$$|$$$$$$|$$$$$|  ]    ║
// ║   [  |_____|______|_____|  ]    ║
// ╚═════════════════════════════════╝



// 1. Deposit Money
// 2. Determine line bets
// 3. Collect a bet amount
// 4. Spin slot machine
// 5. Check if user won
// 6. give the user their winings
// 7. play again


const prompt = require("prompt-sync")();


const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    "A" : 2,
    "B" : 4,
    "C" : 6,
    "D" : 8
}

// MUltipliers
const SYMBOLS_VALUES = {
    "A" : 5,
    "B" : 4,
    "C" : 3,
    "D" : 2

}



let currency = "ZAR "
const deposit = () => {
    while (true) {
        const depositAmount = prompt("Enter Use a deposit amount: ")
        const numberDepositAmount = parseFloat(depositAmount);

        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0 ){
            console.log("invalid deposit amount, try again.")
        } else {
            return numberDepositAmount;
        }
    }
};

// betchoices
const getNumberOfLines = () => {
    while (true) {
        const lines = prompt("Enter the number of lines to bet on (1-3): ")
        const numberOfLines = parseFloat(lines);

        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3 ){
            console.log("invalid number of lines, try again.")
        } else {
            return numberOfLines;
        }
    }
}; 

const getBet = (balance, lines) => {
    while (true) {
        const bet = prompt("Enter the bet per line: ")
        const numberBet = parseFloat(bet);

        if (isNaN(numberBet ) || numberBet <= 0 || numberBet > (balance / lines) ){
            console.log("invalid bet, try again.")
        } else {
            return numberBet;
        }
    }
}

// amount is based on balance aka deposited amount




const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)){
        // console.log(symbol,count)
        for (let i = 0; i < count; i++) {
            symbols.push(symbol)
        }
    }
    // console.log(symbols)

    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length)
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    
    return reels;
};


const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j= 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }

    return rows;
}

const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, sysmbol] of row.entries()){
            rowString += sysmbol
            if (i != row.length - 1){
                rowString += " | "
            }
        }
        console.log(rowString)
    }
}

const getWinnings = (rows, bet, lines) => {
    let winings = 0

    for (let row = 0; row < lines; row++){
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols) {
            if (symbol != symbols[0]){
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winings += bet * SYMBOLS_VALUES[symbols[0]]
        }
    }

    return winings
}


const game = () => {
    let balance = deposit();
    console.log(currency+(balance))


    while (true) {
        console.log("Balance: "+ currency+(balance)) 
        const numberOfLines = getNumberOfLines()
        const bet = getBet(balance, numberOfLines);
        balance -= bet * numberOfLines;
        console.log("Balance: " + balance) 
        
        
        const reels = spin();
        const rows = transpose(reels)
        printRows(rows)


        const winnings = getWinnings(rows,bet,numberOfLines)
        balance += winnings
        console.log("You won," + currency + (winnings.toString()))
        console.log("Balance: " + currency + (balance)) 

        if (balance <= 0){
            console.log("You have insuffient funds")
            break;
        }
        
        const playAgain = prompt("Do you want to play again? (y/n)")
        
        if (playAgain != "y") break;
    }

};

game();