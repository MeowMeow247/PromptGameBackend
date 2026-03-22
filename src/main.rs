mod prompt_data;
mod jsons;

#[macro_use] extern crate rocket;

use rand::Rng;
use rocket::serde::{Serialize, json::Json};
use rocket::State;
use rocket::http::Method;
use rocket_cors::{AllowedOrigins, CorsOptions};
use crate::jsons::{IntroResponse, MinigameResponse, PromptResponse};
use crate::prompt_data::{Prompt, PromptData};

#[get("/")]
fn index() -> &'static str {
    "not here! open either /introduction, /prompt or /minigame for a random improv prompt!"
}

#[get("/introduction")]
fn introduction(prompt_data: &State<PromptData>) -> Json<IntroResponse> {

    let min: usize = 0;
    let max = prompt_data.introductions.len();
    let num = rand::thread_rng().gen_range(min..=max);

    let introduction = prompt_data.introductions[num].clone();

    Json(IntroResponse{
        success: true,
        introduction
    })
}

#[get("/prompt")]
fn prompt(prompt_data: &State<PromptData>) -> Json<PromptResponse> {

    let min: usize = 0;
    let max = prompt_data.prompts.len();
    let num = rand::thread_rng().gen_range(min..=max);

    let prompt = prompt_data.prompts[num].clone();

    Json(PromptResponse{
        success: true,
        prompt
    })
}

#[get("/minigame")]
fn minigame(prompt_data: &State<PromptData>) -> Json<MinigameResponse> {

    let min: usize = 0;
    let max = prompt_data.minigames.len();
    let num = rand::thread_rng().gen_range(min..=max);

    let minigame = prompt_data.minigames[num].clone();

    Json(MinigameResponse{
        success: true,
        minigame
    })
}

#[launch]
fn rocket() -> _ {
    let prompt_file_path = "./static/prompts_data.json".to_string();
    let prompt_data: PromptData = PromptData::from_file(&prompt_file_path).unwrap_or_else(|| {
        eprintln!("failed to load prompt data struct :(");
        PromptData::empty()
    });

    let cors = CorsOptions::default()
        .allowed_origins(AllowedOrigins::all())
        .allowed_methods(
            vec![Method::Get, Method::Post, Method::Patch]
                .into_iter()
                .map(From::from)
                .collect(),
        )
        .allow_credentials(true);

    rocket::build().mount("/", routes![index, introduction, prompt, minigame]).manage(prompt_data).attach(cors.to_cors().unwrap())
}