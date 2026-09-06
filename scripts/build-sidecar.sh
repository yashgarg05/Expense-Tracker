#!/bin/bash
set -e

# Root directory of the repository
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

# Determine host OS and architecture
RAW_OS="$(uname -s 2>/dev/null || echo "Unknown")"
RAW_ARCH="$(uname -m 2>/dev/null || echo "Unknown")"

case "$RAW_OS" in
    Darwin)
        HOST_OS="macos"
        ;;
    Linux)
        HOST_OS="linux"
        ;;
    MINGW*|MSYS*|CYGWIN*|Windows_NT)
        HOST_OS="windows"
        ;;
    *)
        HOST_OS="unknown"
        ;;
esac

case "$RAW_ARCH" in
    arm64|aarch64)
        HOST_ARCH="aarch64"
        ;;
    x86_64|amd64|AMD64)
        HOST_ARCH="x86_64"
        ;;
    *)
        HOST_ARCH="unknown"
        ;;
esac

# Target triple from argument or env var
TARGET_TRIPLE="${1:-$TARGET_TRIPLE}"

if [ -z "$TARGET_TRIPLE" ]; then
    if [ "$HOST_OS" = "macos" ] && [ "$HOST_ARCH" = "aarch64" ]; then
        TARGET_TRIPLE="aarch64-apple-darwin"
    elif [ "$HOST_OS" = "macos" ] && [ "$HOST_ARCH" = "x86_64" ]; then
        TARGET_TRIPLE="x86_64-apple-darwin"
    elif [ "$HOST_OS" = "linux" ] && [ "$HOST_ARCH" = "x86_64" ]; then
        TARGET_TRIPLE="x86_64-unknown-linux-gnu"
    elif [ "$HOST_OS" = "windows" ] && [ "$HOST_ARCH" = "x86_64" ]; then
        TARGET_TRIPLE="x86_64-pc-windows-msvc"
    else
        echo "Error: Cannot auto-detect target triple for Host OS '$RAW_OS' ($HOST_OS) and Arch '$RAW_ARCH' ($HOST_ARCH)."
        exit 1
    fi
fi

echo "=== Host OS: $HOST_OS ($RAW_OS) | Host Arch: $HOST_ARCH ($RAW_ARCH) ==="
echo "=== Requested Target Triple: $TARGET_TRIPLE ==="

# Validate host architecture compatibility with target triple
case "$TARGET_TRIPLE" in
    aarch64-apple-darwin)
        if [ "$HOST_OS" != "macos" ] || [ "$HOST_ARCH" != "aarch64" ]; then
            echo "Error: Cannot build 'aarch64-apple-darwin' sidecar on host $HOST_OS/$HOST_ARCH."
            echo "PyInstaller requires a native macOS ARM64 runner (e.g. macos-latest)."
            exit 1
        fi
        ;;
    x86_64-apple-darwin)
        if [ "$HOST_OS" != "macos" ] || [ "$HOST_ARCH" != "x86_64" ]; then
            echo "Error: Cannot build 'x86_64-apple-darwin' sidecar on host $HOST_OS/$HOST_ARCH."
            echo "PyInstaller requires a native macOS x86_64 runner (e.g. macos-15-intel)."
            exit 1
        fi
        ;;
    x86_64-unknown-linux-gnu)
        if [ "$HOST_OS" != "linux" ] || [ "$HOST_ARCH" != "x86_64" ]; then
            echo "Error: Cannot build 'x86_64-unknown-linux-gnu' sidecar on host $HOST_OS/$HOST_ARCH."
            echo "PyInstaller requires a native Linux x86_64 runner (e.g. ubuntu-22.04)."
            exit 1
        fi
        ;;
    x86_64-pc-windows-msvc)
        if [ "$HOST_OS" != "windows" ] || [ "$HOST_ARCH" != "x86_64" ]; then
            echo "Error: Cannot build 'x86_64-pc-windows-msvc' sidecar on host $HOST_OS/$HOST_ARCH."
            echo "PyInstaller requires a native Windows x86_64 runner (e.g. windows-latest)."
            exit 1
        fi
        ;;
    *)
        echo "Error: Unrecognized target triple '$TARGET_TRIPLE'."
        exit 1
        ;;
esac

# Determine Python command
if command -v python3 >/dev/null 2>&1; then
    PYTHON_CMD="python3"
elif command -v python >/dev/null 2>&1; then
    PYTHON_CMD="python"
else
    echo "Error: Python binary not found."
    exit 1
fi

echo "=== Using Python: $($PYTHON_CMD --version) ==="

# Ensure PyInstaller is installed
if ! $PYTHON_CMD -m PyInstaller --version >/dev/null 2>&1; then
    echo "PyInstaller not found. Installing PyInstaller..."
    $PYTHON_CMD -m pip install pyinstaller
fi

echo "=== PyInstaller version: $($PYTHON_CMD -m PyInstaller --version) ==="

# Build sidecar binary with PyInstaller
echo "=== Building Python sidecar with PyInstaller ==="
$PYTHON_CMD -m PyInstaller --noconfirm --clean --onefile --name pybridge backend/bridge.py

# Target directory for Tauri externalBin
BIN_DIR="$ROOT_DIR/frontend/src-tauri/bin"
mkdir -p "$BIN_DIR"

# Determine file extension (.exe for Windows)
if [ "$HOST_OS" = "windows" ] || [[ "$TARGET_TRIPLE" == *"windows"* ]]; then
    EXT=".exe"
else
    EXT=""
fi

# Locate PyInstaller output binary
if [ -f "$ROOT_DIR/dist/pybridge.exe" ]; then
    SRC_BINARY="$ROOT_DIR/dist/pybridge.exe"
elif [ -f "$ROOT_DIR/dist/pybridge" ]; then
    SRC_BINARY="$ROOT_DIR/dist/pybridge"
else
    echo "Error: PyInstaller output binary not found in $ROOT_DIR/dist/"
    exit 1
fi

DEST_BINARY="$BIN_DIR/pybridge-${TARGET_TRIPLE}${EXT}"

echo "=== Copying sidecar binary to $DEST_BINARY ==="
cp "$SRC_BINARY" "$DEST_BINARY"

if [ -z "$EXT" ]; then
    chmod +x "$DEST_BINARY"
fi

# Verify executable architecture if 'file' utility is available
if command -v file >/dev/null 2>&1; then
    echo "=== Verifying binary architecture with 'file' ==="
    FILE_INFO="$(file "$DEST_BINARY")"
    echo "$FILE_INFO"

    case "$TARGET_TRIPLE" in
        aarch64-apple-darwin)
            if ! echo "$FILE_INFO" | grep -qiE "arm64|aarch64"; then
                echo "Error: Architecture mismatch! Expected arm64 for $TARGET_TRIPLE, got: $FILE_INFO"
                exit 1
            fi
            ;;
        x86_64-apple-darwin|x86_64-unknown-linux-gnu)
            if ! echo "$FILE_INFO" | grep -qiE "x86_64|x86-64|amd64"; then
                echo "Error: Architecture mismatch! Expected x86_64 for $TARGET_TRIPLE, got: $FILE_INFO"
                exit 1
            fi
            ;;
    esac
fi

echo "=== Sidecar binary build & verification complete: $DEST_BINARY ==="
