#!/bin/bash
set -e

# Root directory of the repository
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "=== Building Python sidecar with PyInstaller ==="
python3 -m PyInstaller --noconfirm --clean --onefile --name pybridge backend/bridge.py

# Target directory for Tauri externalBin
BIN_DIR="$ROOT_DIR/frontend/src-tauri/bin"
mkdir -p "$BIN_DIR"

# Target triple for Apple Silicon macOS
TARGET_TRIPLE="aarch64-apple-darwin"
DEST_BINARY="$BIN_DIR/pybridge-$TARGET_TRIPLE"

echo "=== Copying sidecar binary to $DEST_BINARY ==="
cp "$ROOT_DIR/dist/pybridge" "$DEST_BINARY"
chmod +x "$DEST_BINARY"

echo "=== Sidecar binary build complete ==="
