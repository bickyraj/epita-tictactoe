console.log('Hello from main.js');

let cellsEl = document.querySelectorAll('.cell');
let msgEl = document.querySelector('#msg');

let playersStick= ['X', 'O'];
let currentPlayer = 0;
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
        cellsEl[0].innerHTML == playersStick[currentPlayer] &&
        cellsEl[1].innerHTML == playersStick[currentPlayer] && 
        cellsEl[2].innerHTML == playersStick[currentPlayer]
    ) {
        winner = currentPlayer;
        console.log(currentPlayer + " win !");
    }

    // If no winner found, check if all the cell have been played
    if (winner === false) {
        console.log('Enter no winner !')
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

cellsEl.forEach(cellEl => {
    cellEl.addEventListener('click', function(event) {
        hideMsg();

        if (event.target.innerHTML == '') {
            event.target.innerHTML = playersStick[currentPlayer];

            // verify here
            verify();

            if (!end) {
                if (currentPlayer == 0) {
                    currentPlayer = 1;
                } else {
                    currentPlayer = 0;
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
