#!/bin/bash

# One-time PM2 service setup script
# Run this ONCE on your Ubuntu server to set up PM2 as a system service

echo "🚀 One-time PM2 Service Setup"
echo "============================="

# Check if already set up
if systemctl is-enabled pm2-$USER.service >/dev/null 2>&1; then
    echo "✅ PM2 service is already set up and enabled"
    sudo systemctl status pm2-$USER.service --no-pager
    exit 0
fi

echo "Setting up PM2 as system service..."

# Install PM2 globally if not installed
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
fi

# Create log directory
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2

# Install and configure log rotation
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true

# Setup startup script
echo "Configuring PM2 startup..."
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME

# Enable and start the service
sudo systemctl enable pm2-$USER.service
sudo systemctl start pm2-$USER.service

echo "✅ PM2 service setup complete!"
echo ""
echo "📋 What happens now:"
echo "- PM2 will automatically start on server boot"
echo "- Your applications will auto-restart if they crash"
echo "- Logs are automatically rotated"
echo ""
echo "🔧 Useful commands:"
echo "- pm2 list          # Show running processes"
echo "- pm2 logs          # Show logs"
echo "- pm2 restart all   # Restart all processes"
echo "- pm2 save          # Save current process list"
echo ""
echo "🎉 Your GitHub Actions deployments will now work smoothly!"
