use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct PromptData {
    pub introductions: Vec<Introduction>,
    pub prompts: Vec<Prompt>,
    pub minigames: Vec<Minigame>
}

impl PromptData {
    pub fn from_file(path: &String) -> Option<Self> {
        let file_content = match std::fs::read_to_string(path){
            Ok(content) => content,
            Err(e) => {eprintln!("failed to read file {} {}", path, e); return None}
        };

        let prompts_data: PromptData = serde_json::from_str(file_content.as_str()).expect("JSON was not well-formatted");
        Some(prompts_data)
    }
    pub fn empty() -> Self {
        PromptData {
            introductions: Vec::new(),
            prompts: Vec::new(),
            minigames: Vec::new(),
        }
    }
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Introduction{
    pub introduction: String,
    pub tags: Vec<String>,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Prompt{
    pub prompt: String,
    pub tags: Vec<String>,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Minigame{
    pub minigame: String,
    pub prompts: Vec<MinigamePrompt>,
    pub tags: Vec<String>,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct MinigamePrompt{
    pub prompt: String,
    pub sub_prompts: Vec<String>
}
