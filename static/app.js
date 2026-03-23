
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
