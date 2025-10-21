#!/bin/bash

# PathGen Backend - Firewall Setup Script
# This script configures UFW (Uncomplicated Firewall) for the PathGen API server

set -e

echo "╔════════════════════════════════════════════════════════╗"
echo "║     PathGen API - Firewall Configuration              ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ This script must be run as root (use sudo)"
    exit 1
fi

# Check if UFW is installed
if ! command -v ufw &> /dev/null; then
    echo "📦 UFW not found. Installing..."
    apt-get update
    apt-get install -y ufw
fi

echo "🔧 Configuring firewall rules..."
echo ""

# Reset UFW to default state (optional - comment out if you have existing rules)
# ufw --force reset

# Default policies
echo "→ Setting default policies..."
ufw default deny incoming
ufw default allow outgoing

# Allow SSH (CRITICAL - don't lock yourself out!)
echo "→ Allowing SSH (port 22)..."
ufw allow 22/tcp comment 'SSH'

# Allow HTTP (for Let's Encrypt and Nginx)
echo "→ Allowing HTTP (port 80)..."
ufw allow 80/tcp comment 'HTTP'

# Allow HTTPS
echo "→ Allowing HTTPS (port 443)..."
ufw allow 443/tcp comment 'HTTPS'

# Optional: Allow Node.js direct access (only if needed for testing)
# Uncomment the line below if you want to access Node.js directly on port 3000
# ufw allow 3000/tcp comment 'Node.js API (dev only)'

# Optional: Rate limiting for SSH (prevents brute force)
echo "→ Enabling rate limiting for SSH..."
ufw limit 22/tcp comment 'SSH rate limit'

# Show rules before enabling
echo ""
echo "📋 Configured rules:"
ufw show added

echo ""
read -p "⚠️  Enable firewall with these rules? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Enable UFW
    echo "→ Enabling firewall..."
    ufw --force enable
    
    echo ""
    echo "✅ Firewall configured and enabled!"
    echo ""
    echo "Current status:"
    ufw status verbose
    
    echo ""
    echo "╔════════════════════════════════════════════════════════╗"
    echo "║  Firewall Setup Complete                               ║"
    echo "╚════════════════════════════════════════════════════════╝"
    echo ""
    echo "Open ports:"
    echo "  → 22/tcp   - SSH"
    echo "  → 80/tcp   - HTTP (Nginx)"
    echo "  → 443/tcp  - HTTPS (Nginx)"
    echo ""
    echo "Useful commands:"
    echo "  sudo ufw status        - Check firewall status"
    echo "  sudo ufw status verbose - Detailed status"
    echo "  sudo ufw disable       - Disable firewall"
    echo "  sudo ufw reload        - Reload rules"
    echo ""
else
    echo "❌ Firewall setup cancelled"
    exit 1
fi

