#!/bin/bash

# Deployment Verification Script
# This script verifies that the deployment is working correctly

set -e

echo "🔍 Verifying deployment..."

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

# Check PM2 status
print_status "Checking PM2 status..."
pm2 status

# Check if processes are online
if pm2 status | grep -q "online"; then
    print_status "✅ PM2 processes are online"
else
    print_error "❌ PM2 processes are not online"
    exit 1
fi

# Check application logs for errors
print_status "Checking for errors in application logs..."
ERROR_COUNT=$(pm2 logs pchr-frontend --lines 50 | grep -i "error" | wc -l)
if [ "$ERROR_COUNT" -eq 0 ]; then
    print_status "✅ No errors found in recent logs"
else
    print_warning "⚠️  Found $ERROR_COUNT errors in recent logs"
    pm2 logs pchr-frontend --lines 20 | grep -i "error"
fi

# Check if application is responding (optional - only if you want to test)
print_status "Testing application response (optional)..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ | grep -q "200"; then
    print_status "✅ Application is responding with HTTP 200"
else
    print_warning "⚠️  Application may not be responding on port 3000"
    print_warning "This might be normal if the app is behind a reverse proxy"
fi

# Check system resources
print_status "Checking system resources..."
echo "Memory usage:"
free -h
echo "Disk usage:"
df -h /var/www/pchr-frontend

# Check PM2 process details
print_status "PM2 process details:"
pm2 show pchr-frontend

print_status "🎉 Deployment verification completed!"
print_status "If everything looks good above, your deployment is working correctly."
