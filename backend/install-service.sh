#!/bin/bash

# PathGen Backend - Service Installation Script
# This script installs and enables the systemd service for PathGen API

set -e

echo "╔════════════════════════════════════════════════════════╗"
echo "║     PathGen API - Service Installation                ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ This script must be run as root (use sudo)"
    exit 1
fi

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SERVICE_FILE="$SCRIPT_DIR/pathgen-auth.service"

# Check if service file exists
if [ ! -f "$SERVICE_FILE" ]; then
    echo "❌ Service file not found: $SERVICE_FILE"
    exit 1
fi

# Check if .env file exists
if [ ! -f "$SCRIPT_DIR/.env" ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "Please create .env file before starting the service"
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js v22 first."
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✓ Found Node.js $NODE_VERSION"

# Update the service file with actual path
ACTUAL_PATH="$SCRIPT_DIR"
echo "→ Service will run from: $ACTUAL_PATH"

# Create a temporary service file with correct paths
TEMP_SERVICE="/tmp/pathgen-auth.service"
sed "s|/var/www/PathGen v2/backend|$ACTUAL_PATH|g" "$SERVICE_FILE" > "$TEMP_SERVICE"

# Copy service file to systemd directory
echo "→ Installing service file..."
cp "$TEMP_SERVICE" /etc/systemd/system/pathgen-auth.service
chmod 644 /etc/systemd/system/pathgen-auth.service

# Reload systemd
echo "→ Reloading systemd daemon..."
systemctl daemon-reload

# Enable service (start on boot)
echo "→ Enabling service..."
systemctl enable pathgen-auth.service

echo ""
echo "✅ Service installed successfully!"
echo ""
read -p "Start the service now? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "→ Starting service..."
    systemctl start pathgen-auth.service
    
    # Wait a moment for service to start
    sleep 2
    
    # Check status
    echo ""
    echo "Service status:"
    systemctl status pathgen-auth.service --no-pager
    
    echo ""
    echo "╔════════════════════════════════════════════════════════╗"
    echo "║  Service Installation Complete                         ║"
    echo "╚════════════════════════════════════════════════════════╝"
    echo ""
    echo "Useful commands:"
    echo "  sudo systemctl status pathgen-auth    - Check status"
    echo "  sudo systemctl start pathgen-auth     - Start service"
    echo "  sudo systemctl stop pathgen-auth      - Stop service"
    echo "  sudo systemctl restart pathgen-auth   - Restart service"
    echo "  sudo journalctl -u pathgen-auth -f    - View logs (follow)"
    echo "  sudo journalctl -u pathgen-auth -n 50 - View last 50 log lines"
    echo ""
else
    echo ""
    echo "Service installed but not started."
    echo "Start it later with: sudo systemctl start pathgen-auth"
fi

# Cleanup
rm -f "$TEMP_SERVICE"

