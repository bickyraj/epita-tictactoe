const gridHoverClasses = ["primary-cell", "secondary-cell"];
const player1 = {
    number: 1,
    symbol: "X",
    color: "#ddd13d",
    hoverColorClass: "primary-cell",
    blinkingClass: "blinking-primary"
};

const player2 = {
    number: 2,
    symbol: "O",
    color: "#3dddd6",
    hoverColorClass: "secondary-cell",
    blinkingClass: "blinking-secondary"
};

let cellsEl = document.querySelectorAll('.cell');
let msgEl = document.querySelector('#msg');

let ticTacMap = [ [], [], [] ];
let playersStick= ['X', 'O'];
let currentPlayer = player1;
let end = false;
let winner =false;
let winningLine = [];
let messageTimeOut;

function showMsg(msg) {
    if (messageTimeOut) {
        clearTimeout(messageTimeOut)
    }
    msgEl.innerHTML = msg;
    msgEl.style.display = 'block';
    messageTimeOut = setTimeout(() => {
        msgEl.style.display = 'none';
    }, 2000);
}

const hideMsg = () => {
    msgEl.innerHTML = '';
    msgEl.style.display = 'none';
};

cellsEl.forEach((cellEl, index) => {
    cellEl.addEventListener('click', function(event) {
        event.preventDefault();
        if (!end) {
            placeSymbol(index);
            printMatrix();
            hideMsg();
            if (event.target.querySelector('span').innerHTML == '') {
                event.target.querySelector('span').innerHTML = currentPlayer.symbol;
                event.target.style.color = currentPlayer.color;

                let isVerified = verifyMatrix();
                if (isVerified) {
                    highlightWinningLine();
                    showMsg('Game ended - ' + currentPlayer.number + ' win !');
                    end = true;
                    winner = true;
                    return;
                }

                if (currentPlayer.number == player2.number) {
                    currentPlayer = player1;
                } else {
                    currentPlayer = player2;
                }
                switchPlayerNumberInDiv();
                switchGridHoverColorClass();
            }
        } else {
            if (winner === false) {
                showMsg('Game ended - No winner !');
            } else {
                showMsg('Game ended - Player ' + currentPlayer.number + ' win !');
            }
        }
    });
});

function highlightWinningLine() {
    winningLine.forEach(el => {
        const grid = document.getElementById('grid');
        const gridCell = grid.querySelectorAll('div.cell');
        const index = 3 * el[0] + el[1];
        const winningCell = gridCell[index];
        winningCell.style.backgroundColor = currentPlayer.color;
        winningCell.style.color = "white";
        winningCell.classList.add(currentPlayer.blinkingClass);
        setTimeout(() => {
            winningCell.classList.remove(currentPlayer.blinkingClass);
        }, 900);
    });
}

function switchPlayerNumberInDiv() {
    cellsEl.forEach(element => {
        element.querySelector('div').innerHTML = 'P'+currentPlayer.number;
    });
}

function switchGridHoverColorClass() {
    cellsEl.forEach(element => {
        gridHoverClasses.forEach(hClass => {
            element.classList.remove(hClass);
        });
        element.classList.add(currentPlayer.hoverColorClass);
    });
}

function placeSymbol(index) {
    let counter = 0;
    for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 3; column++) {
            let block = counter;
            if (block == index) {
                ticTacMap[row][column] = currentPlayer.number;
            }
            counter++;
        }
    }
}

function verifyMatrix() {
    // Check horizontal adjacent elements
    if(verifyRowMatch()) {
        return true;
    }

    // Check vertical adjacent elements
    if(verifyColulmnMatch()) {
        return true;
    }

    // Check diagonal elements
    if (verifyRightDiagonalMatch()) {
        return true;
    }

    // Check diagonal elements
    if (verifyLeftDiagonalMatch()) {
        return true;
    }

    return false;
}

function verifyRightDiagonalMatch() {
    let counter = 3;
    for (let i = 0; i < ticTacMap.length; i++) {
        const diagonalElement = ticTacMap[i][i];
        if (diagonalElement === currentPlayer.number) {
            winningLine.push([i, i]);
            counter--;
        }
    }

    if (counter === 0) {
        return true;
    }
    winningLine = [];
    return false;
}

function verifyLeftDiagonalMatch() {
    let counter = 3;
    for (let i = 0; i < ticTacMap.length; i++) {
        const diagonalElement = ticTacMap[i][ticTacMap.length - i - 1];
        if (diagonalElement === currentPlayer.number) {
            winningLine.push([i, ticTacMap.length - i - 1]);
            counter--;
        }
    }

    if (counter == 0) {
        return true;
    }
    winningLine = [];
    return false;
}

function verifyRowMatch() {
    let counter = 3;
    for (var row = 0; row < ticTacMap.length; row++) {
        for (let j = 0; j < ticTacMap.length; j++) {
            if (ticTacMap[row][j] === currentPlayer.number) {
                winningLine.push([row, j]);
                counter--;
            }
        }
        if (counter == 0) {
            return true;
        } else {
            counter = 3;
        }
    }
    winningLine = [];
    return false;
}

function verifyColulmnMatch() {
    let counter = 3;
    for (var col = 0; col < ticTacMap.length; col++) {
        for (let j = 0; j < ticTacMap.length; j++) {
            if (ticTacMap[j][col] === currentPlayer.number) {
                winningLine.push([j, col]);
                counter--;
            }
        }
        if (counter == 0) {
            return true;
        } else {
            counter = 3;
        }
    }
    winningLine = [];
    return false;
}

function printMatrix() {
    for (var row = 0; row < ticTacMap.length; row++) {
      var rowStr = ""; // Initialize an empty string for the row

      for (var col = 0; col < ticTacMap[row].length; col++) {
        rowStr += ticTacMap[row][col] + " "; // Add each element to the row string
      }
    }
}
// 00 01 02
// 10 11 12
// 20 22 22