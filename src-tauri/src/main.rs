// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use models::Credentials;

mod models;
mod queries;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

#[tauri::command(async)]
async fn export_credentials(profile_name: &str) -> Result<Credentials, String> {
    queries::export_credentials(profile_name).await
}

#[tauri::command(async)]
async fn list_profiles() -> Result<Vec<String>, String> {
    queries::list_profiles().await
}

#[tauri::command(async)]
async fn login(profile_name: &str) -> Result<String, String> {
    queries::login(profile_name).await
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            export_credentials,
            list_profiles,
            login
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
