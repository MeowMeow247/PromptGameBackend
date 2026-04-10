let players = [];
let player_turn = 0;
let longest_player_name = 0;

var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? "" : decodeURIComponent(sParameterName[1]);
    }
  }
  return "";
};


let minigame_obj;
let minigame_prompt_index = 0;
let minigame_subprompt_index = 0;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function resetText(){
  document.getElementById("prompt_result").innerHTML = "";
  document.getElementById("minigame_title").innerHTML = "";
  document.getElementById("minigame_prompt").innerHTML = "";
  document.getElementById("minigame_modifier").innerHTML = "";
  document.getElementById("button4").hidden = true;
  document.getElementById("button5").hidden = true;
}

async function getPrompt() {
  resetText();
  const url = "/prompt";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
    document.getElementById("prompt_result").innerHTML = result["prompt"]["prompt"];
  } catch (error) {
    console.error(error.message);
  }
}

async function getIntroduction() {
  resetText();
  const url = "/introduction";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
    document.getElementById("prompt_result").innerHTML = result["introduction"]["introduction"];
  } catch (error) {
    console.error(error.message);
  }
}

function displayMinigame(){
  resetText();
  document.getElementById("minigame_title").innerHTML = minigame_obj["minigame"];
  if (minigame_obj["prompts"].length > 0) {
    document.getElementById("minigame_prompt").innerHTML = minigame_obj["prompts"][minigame_prompt_index]["prompt"];

    if (minigame_obj["prompts"].length > 0) {
      document.getElementById("button5").hidden = false;
    }

    let count_sub_prompts = minigame_obj["prompts"][minigame_prompt_index]["sub_prompts"].length;
    if (count_sub_prompts > 0){
      document.getElementById("button4").hidden = false;
    }


    if (minigame_subprompt_index > 0){
      if (minigame_subprompt_index <= count_sub_prompts){
        document.getElementById("minigame_modifier").innerHTML = minigame_obj["prompts"][minigame_prompt_index]["sub_prompts"][minigame_subprompt_index-1]
      }
      else{
        document.getElementById("minigame_modifier").innerHTML = "all done!";
      }
    }
  }
}

function set_minigame_prompt(){
  if (minigame_obj["prompts"].length > 0){
    minigame_prompt_index = getRandomInt(0, minigame_obj["prompts"].length-1);
    if (minigame_obj["prompts"][minigame_prompt_index]["sub_prompts"].length > 0){
      console.log(minigame_obj["prompts"][minigame_prompt_index]["sub_prompts"]);
      if (minigame_obj["prompts"][minigame_prompt_index]["sub_prompts"][0] === "More"){
        let _ = minigame_obj["prompts"][minigame_prompt_index]["sub_prompts"].shift(); // get rid of the first More
        let count_mores = getRandomInt(2, 6);
        let mores = [];
        for (let x = 1; x <= count_mores; x++) {
          let text = "More";
          for (let y = 0; y < x; y++) {
            text = text.concat("!")
          }
          mores.push(text);
        }
        minigame_obj["prompts"][minigame_prompt_index]["sub_prompts"] = mores.concat(minigame_obj["prompts"][minigame_prompt_index]["sub_prompts"])
      }
    }
    minigame_subprompt_index = 0;
  }
}

async function getMinigame() {
  resetText();
  const url = "/minigame";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);

    minigame_obj = result["minigame"];
    minigame_prompt_index = 0;
    minigame_subprompt_index = 0;
    console.log(minigame_obj["prompts"]);

    set_minigame_prompt();

    displayMinigame();
  } catch (error) {
    console.error(error.message);
  }
}

async function advanceModifier() {
  minigame_subprompt_index += 1;
  displayMinigame();
}

async function newMinigamePrompt() {
  set_minigame_prompt();
  displayMinigame();
}

async function setupPlayers(){
  window.location.href = "/setup";
}

function show_players(){
  let text = "";
  let player_turn = "nobody?";
  for (let x = 0; x < players.length; x++){
    let player_data = players[x];
    //let padding = longest_player_name - player_data['name'].length;
    let padding_text = " ";
    //for (let i = 0; i < padding; i++){
    //  padding_text += " ";
    //}
    text += player_data['name'] + ":" + padding_text + player_data['score'] + " | "
    if (player_data['turn']){
      player_turn = player_data['name'];
    }
  }
  document.getElementById('players_scores').innerHTML = text.slice(0, text.length-2);
  document.getElementById('player_turn').innerHTML = "It's " + player_turn + (player_turn.endsWith("s") ? "'" : "'s") + " turn!";
}

async function givePoint(){
  players[player_turn]['score'] += 1;
  show_players();
}

async function nextPlayer(){
  player_turn += 1;
  if (player_turn > (players.length-1)){
    player_turn = 0;
  }
  set_player_turn();
  show_players();
  await getPrompt();
}

function set_player_turn(){
  for (let x = 0; x < players.length; x++){
    players[x]['turn'] = false;
  }
  players[player_turn]['turn'] = true;
}

function show_base_ui(show){
  document.getElementById('random_text').hidden = !show;
  document.getElementById('button1').hidden = !show;
  document.getElementById('button2').hidden = !show;
  document.getElementById('button3').hidden = !show;
}

function show_players_ui(show){
  document.getElementById("players_scores").hidden = !show;
  document.getElementById("player_turn").hidden = !show;
  document.getElementById("button_add_point").hidden = !show;
  document.getElementById("button_next_player").hidden = !show;
  document.getElementById("button_skip_prompt").hidden = !show;

}

async function init(){
  // get players from request variables
  let players_s = getUrlParameter("players");
  if (players_s.includes(",")){
    let data = [];
    let split = players_s.split(",");
    for (let x = 0; x < split.length; x++){
      let player = split[x];
      data.push({'name': player, 'score': 0, 'turn': false})
      if (player.length > longest_player_name){
        longest_player_name = player.length;
      }
    }
    players = data;
  }
  if (players.length > 0){
    document.getElementById("button_setup").hidden = true;
    set_player_turn();
    show_players();
    await getPrompt();
    show_players_ui(true);
    show_base_ui(false);
  }
  else{
    show_players_ui(false);
    show_base_ui(true);
    document.getElementById("button_setup").hidden = false;
  }
}