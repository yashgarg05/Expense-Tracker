# Expense Tracker

A modern desktop application built with **React**, **Tauri 2**, and a bundled **Python** engine for personal expense tracking and financial visualization.

---

## Installation / Downloads

End users can download pre-built installers directly without installing Python or Node.js.

1. Go to the [GitHub Releases](https://github.com/yashgarg05/Expense-Tracker/releases) page.
2. Download the installer matching your operating system:
   - **macOS Apple Silicon**: `.dmg` (`aarch64-apple-darwin`)
   - **macOS Intel**: `.dmg` (`x86_64-apple-darwin`)
   - **Windows**: `.exe` / `.msi` (`x86_64-pc-windows-msvc`)
   - **Linux**: `.AppImage` (`x86_64-unknown-linux-gnu`)
3. Install and launch the application.
4. **Python is NOT required** on the end user's machine (the Python backend is bundled as a standalone sidecar).
5. **Node.js is NOT required**.

---

## Local Development

To run the desktop application locally in development mode:

1. Ensure **Node.js (v18+)**, **Rust**, and **Python 3** are installed on your machine.
2. Clone the repository:
   ```bash
   git clone https://github.com/yashgarg05/Expense-Tracker.git
   cd Expense-Tracker
   ```
3. Launch the development server:
   ```bash
   cd frontend
   npm run tauri dev
   ```

---

## Release Process

Releases are fully automated via GitHub Actions:

1. Create and push a version tag:
   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```
2. The GitHub Actions workflow (`.github/workflows/release.yml`) builds sidecars and installers for all target platforms (macOS ARM, macOS Intel, Windows x64, Linux x64) and drafts a new release on GitHub.

---

## License

This project is licensed under the MIT License.
