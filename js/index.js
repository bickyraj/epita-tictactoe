const form = document.getElementById('player-form');
const PLAYER1 = "player1";
const PLAYER2 = "player2";

form.addEventListener('submit', function(event) {
    event.preventDefault();
    var player1 = form.elements.player_1.value;
    var player2 = form.elements.player_2.value;
    savePlayerName(player1, player2);
    location.href = "play.html";
});

function savePlayerName(player1, player2) {
    // save to local storage
    localStorage.setItem(PLAYER1, player1);
    localStorage.setItem(PLAYER2, player2);
}
