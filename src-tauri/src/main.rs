// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod queries;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

#[tauri::command]
fn login(profile_name: &str) -> Result<String, String> {
    println!("Begin login");
    let result = queries::login(profile_name);
    println!("End login");
    result
}

#[tauri::command]
fn list_profiles() -> Result<Vec<String>, String> {
    queries::list_profiles()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![login, list_profiles])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
