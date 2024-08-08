use super::exec::exec;

pub fn list_profiles() -> Result<Vec<String>, String> {
    let result = exec("aws", &["configure", "list-profiles"]);
    match result {
        Ok(s) => {
            let profiles = s.split("\n").map(|s| s.to_string()).collect::<Vec<String>>();
            Ok(profiles)
        },
        Err(s) => return Err(s),
    }
}
