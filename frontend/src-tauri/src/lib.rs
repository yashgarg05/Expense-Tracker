use std::path::PathBuf;

fn get_python_binary() -> &'static str {
  if std::process::Command::new("python3").arg("--version").output().is_ok() {
    "python3"
  } else {
    "python"
  }
}

fn get_bridge_path() -> PathBuf {
  let cwd = std::env::current_dir().unwrap_or_default();
  let mut curr = cwd.clone();
  loop {
    let candidate = curr.join("backend").join("bridge.py");
    if candidate.exists() {
      return candidate.canonicalize().unwrap_or(candidate);
    }
    if !curr.pop() {
      break;
    }
  }
  cwd.join("..").join("..").join("backend").join("bridge.py")
}

fn run_python_bridge(command: &str, payload: Option<serde_json::Value>) -> Result<serde_json::Value, String> {
  let python_bin = get_python_binary();
  let bridge_path = get_bridge_path();
  let payload_str = payload.map(|v| v.to_string()).unwrap_or_else(|| "{}".to_string());

  let output = std::process::Command::new(python_bin)
    .arg(&bridge_path)
    .arg(command)
    .arg(&payload_str)
    .output()
    .map_err(|e| format!("Failed to execute Python process: {}", e))?;

  let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
  if stdout.is_empty() {
    let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();
    return Err(format!("Python process returned empty response. Stderr: {}", stderr));
  }

  let json_res: serde_json::Value = serde_json::from_str(&stdout)
    .map_err(|e| format!("Failed to parse Python JSON output: {} (raw: {})", e, stdout))?;

  if json_res.get("success").and_then(|v| v.as_bool()) == Some(true) {
    Ok(json_res.get("data").cloned().unwrap_or(serde_json::Value::Null))
  } else {
    let err_msg = json_res.get("error").and_then(|v| v.as_str()).unwrap_or("Unknown backend error");
    Err(err_msg.to_string())
  }
}

#[tauri::command]
fn get_transactions() -> Result<serde_json::Value, String> {
  run_python_bridge("get_transactions", None)
}

#[tauri::command]
fn add_transaction(transaction: serde_json::Value) -> Result<serde_json::Value, String> {
  run_python_bridge("add_transaction", Some(transaction))
}

#[tauri::command]
fn update_transaction(transaction: serde_json::Value) -> Result<serde_json::Value, String> {
  run_python_bridge("update_transaction", Some(transaction))
}

#[tauri::command]
fn delete_transaction(id: String) -> Result<serde_json::Value, String> {
  let payload = serde_json::json!({ "id": id });
  run_python_bridge("delete_transaction", Some(payload))
}

#[tauri::command]
fn clear_transactions() -> Result<serde_json::Value, String> {
  run_python_bridge("clear_transactions", None)
}

#[tauri::command]
fn get_summary() -> Result<serde_json::Value, String> {
  run_python_bridge("get_summary", None)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      get_transactions,
      add_transaction,
      update_transaction,
      delete_transaction,
      clear_transactions,
      get_summary
    ])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

