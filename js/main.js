const gridHoverClasses = ["primary-cell", "secondary-cell"];
const PLAYER1 = "player1";
const PLAYER2 = "player2";
var MARK_COUNTER = 0;
const player1 = {
    name: "",
    number: 1,
    symbol: "X",
    color: "#ddd13d",
    score: 0,
    hoverColorClass: "primary-cell",
    blinkingClass: "blinking-primary"
};

const player1ScoreElement = document.getElementById("player1Score");
const player2ScoreElement = document.getElementById("player2Score");

const quitBtn = document.getElementById("quit-btn");
const restartBtn = document.getElementById("restart-btn");
const playAgainBtn = document.getElementById("play-again-btn");

const player2 = {
    name: "",
    number: 2,
    symbol: "O",
    color: "#3dddd6",
    score: 0,
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
        if (!end && MARK_COUNTER < 9) {
            placeSymbol(index);
            printMatrix();
            hideMsg();
            if (event.target.querySelector('span').innerHTML == '') {
                MARK_COUNTER++;
                event.target.querySelector('span').innerHTML = currentPlayer.symbol;
                event.target.style.color = currentPlayer.color;

                let isVerified = verifyMatrix();
                if (isVerified) {
                    highlightWinningLine();
                    showMsg('Player ' + currentPlayer.number + ' win !');
                    end = true;
                    winner = true;
                    currentPlayer.score++;
                    updatePlayerScore();
                    updatePlayerDataToLocalStorage();
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
                showMsg('Game ended no winner !');
            } else {
                showMsg('Player ' + currentPlayer.number + ' win !');
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

function isKeySet(key) {
  var value = localStorage.getItem(key);
  return value !== null && value !== undefined;
}

function initPlayerName() {
    if (isKeySet(PLAYER1) && isKeySet(PLAYER2)) {
        player1.name = localStorage.getItem(PLAYER1)
        player2.name = localStorage.getItem(PLAYER2)

        const player1Block = document.getElementById(PLAYER1);
        const player2Block = document.getElementById(PLAYER2);
        player1Block.querySelector('.player-name').textContent  = player1.name;
        player2Block.querySelector('.player-name').textContent  = player2.name;
    }
}

quitBtn.addEventListener('click', function(event) {
    event.preventDefault();
    clearLocalStorage();
    location.href = "index.html";
});

restartBtn.addEventListener('click', function(event) {
    event.preventDefault();
    restartGame();
});

playAgainBtn.addEventListener('click', function(event) {
    event.preventDefault();
    location.href = "play.html";
});

function clearLocalStorage() {
    localStorage.clear();
}

function restartGame() {
    player1.score = 0;
    player2.score = 0;
    var player1Data = JSON.stringify(player1);
    var player2Data = JSON.stringify(player2);
    localStorage.setItem("player1Data", player1Data);
    localStorage.setItem("player2Data", player2Data);
    location.href = "play.html";
}

function updatePlayerScore() {
    player1ScoreElement.textContent = player1.score;
    player2ScoreElement.textContent = player2.score;
}

function updatePlayerDataToLocalStorage() {
    var player1Data = JSON.stringify(player1);
    var player2Data = JSON.stringify(player2);
    localStorage.setItem("player1Data", player1Data);
    localStorage.setItem("player2Data", player2Data);
}
function initGame() {
    var player1DataJson = localStorage.getItem("player1Data");
    var player2DataJson = localStorage.getItem("player2Data");

    var player1Data = JSON.parse(player1DataJson);
    var player2Data = JSON.parse(player2DataJson);
    player1.score = player1Data.score;
    player2.score = player2Data.score;
    updatePlayerScore();
} 
initPlayerName();
initGame();
// 00 01 02
// 10 11 12
// 20 22 22