use super::exec::exec;

pub fn login(profile_name: &str) -> Result<String, String> {
    let result = exec("aws", &["sso", "login", "--profile", profile_name]);

    match result {
        Ok(_) => Ok(format!("Logged in to {}", profile_name)),
        Err(s) => return Err(s),
    }
}
