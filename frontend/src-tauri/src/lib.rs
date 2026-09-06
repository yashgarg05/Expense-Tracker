use std::path::PathBuf;
use tauri::{AppHandle, Manager};

fn get_dev_bridge_path() -> PathBuf {
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

fn target_triple() -> &'static str {
  if cfg!(all(target_os = "macos", target_arch = "aarch64")) {
    "aarch64-apple-darwin"
  } else if cfg!(all(target_os = "macos", target_arch = "x86_64")) {
    "x86_64-apple-darwin"
  } else if cfg!(all(target_os = "windows", target_arch = "x86_64")) {
    "x86_64-pc-windows-msvc"
  } else if cfg!(all(target_os = "linux", target_arch = "x86_64")) {
    "x86_64-unknown-linux-gnu"
  } else {
    if cfg!(target_os = "macos") {
      "aarch64-apple-darwin"
    } else if cfg!(target_os = "windows") {
      "x86_64-pc-windows-msvc"
    } else {
      "x86_64-unknown-linux-gnu"
    }
  }
}

fn get_sidecar_path(app: &AppHandle) -> Option<PathBuf> {
  let triple = target_triple();
  let ext = if cfg!(target_os = "windows") { ".exe" } else { "" };
  let sidecar_name = format!("pybridge-{}{}", triple, ext);
  let sidecar_base = format!("pybridge{}", ext);

  // 1. Check executable directory (e.g. MacOS/ or app folder)
  if let Ok(exe_path) = std::env::current_exe() {
    if let Some(exe_dir) = exe_path.parent() {
      let candidate1 = exe_dir.join(&sidecar_name);
      if candidate1.exists() {
        return Some(candidate1);
      }
      let candidate2 = exe_dir.join(&sidecar_base);
      if candidate2.exists() {
        return Some(candidate2);
      }
    }
  }

  // 2. Check resource directory
  if let Ok(res_dir) = app.path().resource_dir() {
    let candidate1 = res_dir.join("bin").join(&sidecar_name);
    if candidate1.exists() {
      return Some(candidate1);
    }
    let candidate2 = res_dir.join("bin").join(&sidecar_base);
    if candidate2.exists() {
      return Some(candidate2);
    }
    let candidate3 = res_dir.join(&sidecar_name);
    if candidate3.exists() {
      return Some(candidate3);
    }
    let candidate4 = res_dir.join(&sidecar_base);
    if candidate4.exists() {
      return Some(candidate4);
    }
  }

  None
}

fn run_python_bridge(
  app: &AppHandle,
  command: &str,
  payload: Option<serde_json::Value>,
) -> Result<serde_json::Value, String> {
  let app_data_dir = app
    .path()
    .app_data_dir()
    .unwrap_or_else(|_| PathBuf::from("./data"));

  if let Err(e) = std::fs::create_dir_all(&app_data_dir) {
    eprintln!("Warning: Failed to create app_data_dir {:?}: {}", app_data_dir, e);
  }

  let sidecar_path = get_sidecar_path(app);
  let payload_str = payload.map(|v| v.to_string()).unwrap_or_else(|| "{}".to_string());

  let mut cmd = if let Some(path) = sidecar_path {
    // Production / Bundled sidecar mode
    let mut c = std::process::Command::new(path);
    c.arg(command);
    c.arg(&payload_str);
    c.env("EXPENSE_TRACKER_DATA_DIR", &app_data_dir);
    c
  } else if cfg!(debug_assertions) {
    // Development mode with system python
    let python_bin = if std::process::Command::new("python3").arg("--version").output().is_ok() {
      "python3"
    } else {
      "python"
    };
    let bridge_path = get_dev_bridge_path();
    let mut c = std::process::Command::new(python_bin);
    c.arg(&bridge_path);
    c.arg(command);
    c.arg(&payload_str);
    c.env("EXPENSE_TRACKER_DATA_DIR", &app_data_dir);
    c
  } else {
    return Err(format!(
      "Production build error: Sidecar binary not found for target triple '{}'.",
      target_triple()
    ));
  };

  #[cfg(target_os = "windows")]
  {
    use std::os::windows::process::CommandExt;
    cmd.creation_flags(0x08000000); // CREATE_NO_WINDOW
  }

  let output = cmd
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
fn get_transactions(app: AppHandle) -> Result<serde_json::Value, String> {
  run_python_bridge(&app, "get_transactions", None)
}

#[tauri::command]
fn add_transaction(app: AppHandle, transaction: serde_json::Value) -> Result<serde_json::Value, String> {
  run_python_bridge(&app, "add_transaction", Some(transaction))
}

#[tauri::command]
fn update_transaction(app: AppHandle, transaction: serde_json::Value) -> Result<serde_json::Value, String> {
  run_python_bridge(&app, "update_transaction", Some(transaction))
}

#[tauri::command]
fn delete_transaction(app: AppHandle, id: String) -> Result<serde_json::Value, String> {
  let payload = serde_json::json!({ "id": id });
  run_python_bridge(&app, "delete_transaction", Some(payload))
}

#[tauri::command]
fn clear_transactions(app: AppHandle) -> Result<serde_json::Value, String> {
  run_python_bridge(&app, "clear_transactions", None)
}

#[tauri::command]
fn get_summary(app: AppHandle) -> Result<serde_json::Value, String> {
  run_python_bridge(&app, "get_summary", None)
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
