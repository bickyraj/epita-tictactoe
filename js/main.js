console.log('Hello from main.js');

const player1 = {
    number: 1,
    symbol: "X",
    color: "#ddd13d"
};

const player2 = {
    number: 2,
    symbol: "O",
    color: "#3dddd6"
};

let cellsEl = document.querySelectorAll('.cell');
let msgEl = document.querySelector('#msg');

let ticTacMap = [ [], [], [] ];
let playersStick= ['X', 'O'];
let currentPlayer = player1;
let end = false;
let winner =false;

function showMsg(msg) {
    msgEl.innerHTML = msg;
    msgEl.style.display = 'block';
}

const hideMsg = () => {
    msgEl.innerHTML = '';
    msgEl.style.display = 'none';
};

const verify = () => {
    let found = false
    
    if (
        cellsEl[0].innerHTML == playersStick[currentPlayer.symbol] &&
        cellsEl[1].innerHTML == playersStick[currentPlayer.symbol] && 
        cellsEl[2].innerHTML == playersStick[currentPlayer.symbol]
    ) {
        winner = currentPlayer.number;
        // console.log(currentPlayer.number + " win !");
    }

    // If no winner found, check if all the cell have been played
    if (winner === false) {
        // console.log('Enter no winner !')
        cellsEl.forEach(cellEl => {
            if (cellEl.innerHTML == '') {
                found = true;
            }
        });
    }

    console.log(found, winner);

    if (!found || winner !== false) {
        end = true;
    }
};

cellsEl.forEach((cellEl, index) => {
    cellEl.addEventListener('click', function(event) {
        placeSymbol(index);
        printMatrix();
        hideMsg();
        if (event.target.innerHTML == '') {
            event.target.innerHTML = currentPlayer.symbol;
            event.target.style.color = currentPlayer.color;

            // verify here
            verify();

            if (!end) {
                if (currentPlayer.number == player2.number) {
                    currentPlayer = player1;
                } else {
                    currentPlayer = player2;
                }
            } else {
                if (winner === false) {
                    showMsg('Game ended - No winner !');
                } else {
                    showMsg('Game ended - ' + winner + ' win !');
                }
            }
        } else {
            // alert('Already played !');
            showMsg('Already played !');
        }
    });
});

function placeSymbol(index) {
    let counter = 0;
    for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 3; column++) {
            let block = counter;
            if (block == index) {
                ticTacMap[row][column] = currentPlayer.number;
                console.log("yess clicked on "+index);
            }
            counter++;
        }
    }
}

function verifyMatrix() {
    for (var row = 0; row < ticTacMap.length; row++) {
        for (var col = 0; col < ticTacMap[row].length; col++) {
            rowStr += ticTacMap[row][col] + " "; // Add each element to the row string
        }
    }
}

function printMatrix() {
    for (var row = 0; row < ticTacMap.length; row++) {
      var rowStr = ""; // Initialize an empty string for the row

      for (var col = 0; col < ticTacMap[row].length; col++) {
        rowStr += ticTacMap[row][col] + " "; // Add each element to the row string
      }

      console.log(rowStr.trim()); // Print the row, removing any trailing whitespace
    }
}
// 00 01 02
// 10 11 12
// 20 22 22