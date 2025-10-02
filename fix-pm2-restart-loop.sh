#!/bin/bash

# PM2 Restart Loop Fix Script
# This script fixes the PM2 restart loop issue for the Next.js frontend

set -e

echo "🔧 Fixing PM2 restart loop issue..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    print_error "This script must be run as root or with sudo"
    exit 1
fi

# Stop all PM2 processes
print_status "Stopping all PM2 processes..."
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true

# Clear PM2 logs
print_status "Clearing PM2 logs..."
pm2 flush

# Navigate to application directory
APP_DIR="/var/www/pchr-frontend/current"
if [ ! -d "$APP_DIR" ]; then
    print_error "Application directory not found: $APP_DIR"
    exit 1
fi

cd "$APP_DIR"

# Check if build exists
if [ ! -d ".next" ]; then
    print_status "Building application..."
    npm run build
fi

# Start with the fixed configuration
print_status "Starting application with fixed PM2 configuration..."
pm2 start ecosystem.production.config.js --env production

# Wait a bit for the application to start
print_status "Waiting for application to start..."
sleep 10

# Check status
print_status "Checking PM2 status..."
pm2 status

# Save PM2 configuration
pm2 save

# Show detailed logs for verification
print_status "Recent application logs:"
pm2 logs pchr-frontend --lines 20

# Show any errors from the last restart
print_status "Checking for recent errors..."
if [ -f "/var/log/pm2/pchr-frontend-error.log" ]; then
    print_status "Recent error logs:"
    tail -n 20 /var/log/pm2/pchr-frontend-error.log
fi

# Show PM2 process details
print_status "PM2 process details:"
pm2 show pchr-frontend

print_status "✅ PM2 restart loop fix completed!"
print_status "Application should now be running without restart loops."
print_warning "If you still see restart issues, check the error logs above for specific error messages."
