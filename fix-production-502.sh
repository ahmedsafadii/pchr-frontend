#!/bin/bash

# Production 502 Error Fix Script
# Run this on your Ubuntu production server

echo "🔧 Fixing Production 502 Errors"
echo "==============================="

# Check if running as root or with sudo
if [ "$EUID" -eq 0 ]; then
    echo "❌ Don't run this script as root. Run as your user account."
    exit 1
fi

# Navigate to app directory
cd /var/www/nextapp || {
    echo "❌ App directory not found. Make sure the app is deployed."
    exit 1
}

echo "✅ Found app directory"

# Stop PM2 processes
echo "🛑 Stopping PM2 processes..."
pm2 stop nextapp 2>/dev/null || echo "No running processes to stop"
pm2 delete nextapp 2>/dev/null || echo "No processes to delete"

# Check Node.js and npm versions
echo "📋 Checking environment..."
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --omit=dev

# Build the application
echo "🏗️  Building application..."
npm run build

# Check if build was successful
if [ ! -d ".next" ]; then
    echo "❌ Build failed - .next directory not found"
    exit 1
fi

echo "✅ Build successful"

# Start PM2 with new configuration
echo "🚀 Starting PM2 with improved configuration..."
pm2 start ecosystem.config.js

# Wait a moment for startup
sleep 5

# Check PM2 status
echo "📊 PM2 Status:"
pm2 status

# Check if app is responding
echo "🔍 Testing application..."
if curl -f -s http://localhost:3000 > /dev/null; then
    echo "✅ Application is responding on port 3000"
else
    echo "❌ Application is not responding on port 3000"
    echo "📋 Recent logs:"
    pm2 logs nextapp --lines 20
fi

# Save PM2 configuration
echo "💾 Saving PM2 configuration..."
pm2 save

# Check PM2 service status
echo "🔧 Checking PM2 service status..."
if systemctl is-enabled pm2-$USER.service >/dev/null 2>&1; then
    echo "✅ PM2 service is enabled"
    sudo systemctl status pm2-$USER.service --no-pager -l
else
    echo "⚠️  PM2 service is not enabled. Setting up..."
    pm2 startup
    echo "Run the sudo command shown above, then:"
    echo "pm2 save"
    echo "sudo systemctl enable pm2-$USER.service"
fi

# Show recent logs
echo "📋 Recent application logs:"
pm2 logs nextapp --lines 10

echo ""
echo "✅ Production 502 fix complete!"
echo ""
echo "🔍 If you still get 502 errors, check:"
echo "1. pm2 logs nextapp"
echo "2. tail -f /var/log/pm2/nextapp-error.log"
echo "3. Check nginx/reverse proxy configuration"
echo "4. Verify port 3000 is accessible"
