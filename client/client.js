console.log('hello')

const socket = io();
let player1 = false;
let roomUniqueId = null;

function createGame() {
    player1 = true;
    socket.emit('createGame');
}

function joinGame() {
    roomUniqueId = document.getElementById('roomUniqueId').value;
    console.log(roomUniqueId);
    socket.emit('joinGame', { roomUniqueId: roomUniqueId });
}

socket.on("newGame", (data) => {
    roomUniqueId = data.roomUniqueId;
    document.getElementById('initial').style.display = 'none';
    document.getElementById('gamePlay').style.display = 'block';
    let copyButton = document.createElement('button');
    copyButton.style.display = 'block';
    copyButton.innerText = 'Copy Code';
    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(roomUniqueId).then(function () {
            console.log('Async : Copying to clipboard was successfull');
        }, function (err) {
            console.error('Asyn : Could not copy text :', err);
        });
    });
    document.getElementById('waitingArea').innerHTML = `Waiting for the opponent, please share the code ${roomUniqueId} to join`;
    document.getElementById('waitingArea').appendChild(copyButton);
})

socket.on("playersConnected", () => {
    document.getElementById('initial').style.display = 'none';
    document.getElementById('waitingArea').style.display = 'none';
    document.getElementById('gameArea').style.display = 'block';
})

socket.on("p1Choice", (data) => {
    if (!player1) {
        createOpponentChoiceButton(data);
    }
});

socket.on("p2Choice", (data) => {
    if (player1) {
        createOpponentChoiceButton(data);
    }
});

socket.on("result", (data) => {
    let winnerText = '';
    if (data.winner != 'd') {
        if (data.winner == 'p1' && player1) {
            winnerText = "You win";
        }
        else if (data.winner == 'p1') {
            winnerText = 'You lose';
        }
        else if (data.winner == 'p2' && !player1) {
            winnerText = 'You win';
        }
        else if (data.winner == 'p2') {
            winnerText = 'You lose';
        }

    }
    else {
        winnerText = `It's a draw`;
    }

    document.getElementById('opponentState').style.display = 'none';
    document.getElementById('opponentButton').style.display = 'block';
    document.getElementById('winnerArea').innerHTML = winnerText;

})



function sendChoice(rpsValue) {
    const choiceEvent = player1 ? "p1Choice" : "p2Choice";
    socket.emit(choiceEvent, {
        rpsValue: rpsValue,
        roomUniqueId: roomUniqueId
    });

    let playerChoiceButton = document.createElement('button');
    playerChoiceButton.style.display = 'block';
    playerChoiceButton.innerText = rpsValue;
    document.getElementById('player1Choice').innerHTML = '';
    document.getElementById('player1Choice').appendChild(playerChoiceButton)
}


function createOpponentChoiceButton(data) {
    document.getElementById('opponentState').innerHTML = "Opponent made a choice";
    let opponentButton = document.createElement('button');
    opponentButton.id = 'opponentButton';
    opponentButton.style.display = 'none';
    opponentButton.innerText = data.rpsValue;
    document.getElementById('player2Choice').appendChild(opponentButton);
}




