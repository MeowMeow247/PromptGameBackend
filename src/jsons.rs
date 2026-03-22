use rocket::serde::{Deserialize, Serialize};
use crate::prompt_data::{Introduction, Minigame, Prompt};

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct IntroResponse{
    pub success: bool,
    pub introduction: Introduction
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct PromptResponse{
    pub success: bool,
    pub prompt: Prompt
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct MinigameResponse{
    pub success: bool,
    pub minigame: Minigame
}