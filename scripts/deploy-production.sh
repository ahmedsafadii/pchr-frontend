#!/bin/bash

# Production Deployment Script
# This script deploys the frontend to the production environment

set -e  # Exit on any error

echo "🚀 Starting production deployment..."

# Configuration
DEPLOY_DIR="/var/www/pchr-frontend"
BACKUP_DIR="$DEPLOY_DIR/backups"
RELEASES_DIR="$DEPLOY_DIR/releases"
CURRENT_DIR="$DEPLOY_DIR/current"
LOG_DIR="/var/log/pchr-frontend"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Create necessary directories
print_status "Creating deployment directories..."
mkdir -p "$DEPLOY_DIR" "$BACKUP_DIR" "$RELEASES_DIR" "$LOG_DIR"

# Get the current commit hash
COMMIT_HASH=$(git rev-parse HEAD)
RELEASE_DIR="$RELEASES_DIR/$COMMIT_HASH"

print_status "Deploying commit: $COMMIT_HASH"

# Create release directory
print_status "Creating release directory..."
mkdir -p "$RELEASE_DIR"

# Copy application files
print_status "Copying application files..."
cp -r . "$RELEASE_DIR/"

# Navigate to release directory
cd "$RELEASE_DIR"

# Install dependencies
print_status "Installing dependencies..."
npm ci --production

# Build the application
print_status "Building application..."
npm run build

# Set correct permissions
print_status "Setting permissions..."
chown -R www-data:www-data "$RELEASE_DIR"
chmod -R 755 "$RELEASE_DIR"

# Backup current deployment if it exists
if [ -d "$CURRENT_DIR" ]; then
    BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
    print_status "Backing up current deployment to $BACKUP_NAME..."
    mv "$CURRENT_DIR" "$BACKUP_DIR/$BACKUP_NAME"
fi

# Create symlink to new release
print_status "Creating symlink to new release..."
ln -sfn "$RELEASE_DIR" "$CURRENT_DIR"

# Stop existing PM2 processes
print_status "Stopping existing PM2 processes..."
pm2 stop pchr-frontend 2>/dev/null || true
pm2 delete pchr-frontend 2>/dev/null || true

# Start application with PM2
print_status "Starting application with PM2..."
cd "$CURRENT_DIR"
pm2 start ecosystem.production.config.js --env production

# Save PM2 configuration
pm2 save

# Health check
print_status "Performing health check..."
sleep 10
if curl -f http://localhost:3000/ > /dev/null 2>&1; then
    print_status "✅ Health check passed"
else
    print_error "❌ Health check failed - application is not responding"
    print_error "Checking PM2 status..."
    pm2 status
    print_error "Checking application logs..."
    pm2 logs pchr-frontend --lines 20
    exit 1
fi

# Cleanup old releases (keep last 5)
print_status "Cleaning up old releases..."
cd "$RELEASES_DIR"
ls -t | tail -n +6 | xargs -r rm -rf

# Cleanup old backups (keep last 3)
print_status "Cleaning up old backups..."
cd "$BACKUP_DIR"
ls -t backup-* 2>/dev/null | tail -n +4 | xargs -r rm -rf || true

print_status "🎉 Production deployment completed successfully!"
print_status "Application is running at: http://localhost:3000"
print_status "PM2 status:"
pm2 status
