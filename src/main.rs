mod prompt_data;
mod jsons;

#[macro_use] extern crate rocket;

use rand::Rng;
use rocket::fs::NamedFile;
use rocket::serde::{Serialize, json::Json};
use rocket::State;
use rocket::http::Method;
use rocket_cors::{AllowedOrigins, CorsOptions};
use crate::jsons::{IntroResponse, MinigameResponse, PromptResponse};
use crate::prompt_data::{Prompt, PromptData};

fn time_nice() -> String {
    let now = chrono::Utc::now();
    now.to_rfc3339_opts(chrono::SecondsFormat::Secs, true)

}

#[get("/introduction")]
fn introduction(prompt_data: &State<PromptData>) -> Json<IntroResponse> {

    let min: usize = 0;
    let max = prompt_data.introductions.len();
    let num = rand::thread_rng().gen_range(min..max);

    let introduction = prompt_data.introductions[num].clone();

    println!("[{}] served an Introduction", time_nice());
    Json(IntroResponse{
        success: true,
        introduction
    })
}

#[get("/prompt")]
fn prompt(prompt_data: &State<PromptData>) -> Json<PromptResponse> {

    let min: usize = 0;
    let max = prompt_data.prompts.len();
    let num = rand::thread_rng().gen_range(min..max);

    let prompt = prompt_data.prompts[num].clone();

    println!("[{}] served a Prompt", time_nice());
    Json(PromptResponse{
        success: true,
        prompt
    })
}

#[get("/minigame")]
fn minigame(prompt_data: &State<PromptData>) -> Json<MinigameResponse> {

    let min: usize = 0;
    let max = prompt_data.minigames.len();
    let num = rand::thread_rng().gen_range(min..max);

    let minigame = prompt_data.minigames[num].clone();

    println!("[{}] served a Minigame", time_nice());
    Json(MinigameResponse{
        success: true,
        minigame
    })
}

#[get("/app.js")]
async fn app() -> Option<NamedFile>{
    println!("[{}] served app.js", time_nice());
    NamedFile::open("/static/app.js").await.ok()
}

#[get("/style.css")]
async fn style() -> Option<NamedFile>{
    println!("[{}] served style.css", time_nice());
    NamedFile::open("/static/style.css").await.ok()
}

#[get("/favicon.ico")]
async fn favicon() -> Option<NamedFile>{
    println!("[{}] served favicon.ico", time_nice());
    NamedFile::open("/static/favicon.ico").await.ok()
}

#[get("/index.html")]
async fn index_html() -> Option<NamedFile>{
    println!("[{}] served index.html", time_nice());
    NamedFile::open("/static/index.html").await.ok()
}

#[get("/")]
async fn index() -> Option<NamedFile> {
    println!("[{}] served index.html", time_nice());
    NamedFile::open("/static/index.html").await.ok()
}

#[get("/setup")]
async fn setup() -> Option<NamedFile> {
    println!("[{}] served setup.html", time_nice());
    NamedFile::open("/static/setup.html").await.ok()
}

#[get("/setup.js")]
async fn setup_js() -> Option<NamedFile> {
    println!("[{}] served setup.js", time_nice());
    NamedFile::open("/static/setup.js").await.ok()
}

#[launch]
fn rocket() -> _ {
    let prompt_file_path = "/static/prompts_data.json".to_string();
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
    println!("[{}] starting...", time_nice());
    rocket::build().mount("/", routes![index, app, style, favicon, index_html, introduction, prompt, minigame, setup, setup_js]).manage(prompt_data).attach(cors.to_cors().unwrap())
}