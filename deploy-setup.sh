#!/bin/bash

# PM2 Service Setup Script for Ubuntu Server
# Run this script on your Ubuntu server to set up PM2 as a system service

set -e

echo "🚀 Setting up PM2 as a system service..."

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 is not installed. Installing PM2..."
    npm install -g pm2
fi

# Create log directory
echo "📁 Creating log directory..."
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2

# Install PM2 log rotation module
echo "🔄 Installing PM2 log rotation..."
pm2 install pm2-logrotate

# Set up PM2 log rotation configuration
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true

# Setup PM2 startup script
echo "⚙️  Setting up PM2 startup script..."
pm2 startup

echo "🔧 Please run the command that was just displayed above with sudo"
echo "Then come back and run: pm2 save"

# Instructions for manual completion
cat << 'EOF'

📋 MANUAL STEPS REQUIRED:

1. Copy and run the 'sudo env PATH=...' command that was displayed above
2. Run: pm2 save
3. Run: sudo systemctl enable pm2-$USER.service
4. Run: sudo systemctl start pm2-$USER.service

Then your PM2 will automatically start on boot and restart your applications!

🔍 Useful PM2 commands:
- pm2 status          # Check running processes
- pm2 logs            # View logs
- pm2 restart all     # Restart all processes
- pm2 reload all      # Zero-downtime reload
- pm2 save            # Save current process list
- pm2 resurrect       # Restore saved processes

EOF
