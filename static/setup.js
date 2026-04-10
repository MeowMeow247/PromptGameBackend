let players = []

function showPlayers(){
    let text = "Go on, get some Friends!";
    if (players.length > 0){
        text = "";
        for (let i = 0; i < players.length; i++){
            let name = players[i];
            text += name + ", ";
        }
        text = text.slice(0, text.length-2);
    }
    document.getElementById("text_players").innerHTML = text;
}

async function resetPlayers(){
    players = [];
    showPlayers();
}

async function finishSetup(){
    window.location.href = ("/?players=" + players.join(","));
}

async function addPlayer(){
    let name = document.getElementById('player_input').value;
    players.push(name);
    document.getElementById('player_input').value = "";
    showPlayers();
}