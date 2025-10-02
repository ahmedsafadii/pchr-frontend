#!/bin/bash

# Server Setup Script
# This script sets up the server environment for PCHR Frontend deployment

set -e  # Exit on any error

echo "🔧 Setting up server environment for PCHR Frontend..."

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

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "This script must be run as root"
    exit 1
fi

# Update system packages
print_status "Updating system packages..."
apt-get update
apt-get upgrade -y

# Install Node.js 20
print_status "Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install PM2 globally
print_status "Installing PM2..."
npm install -g pm2

# Install nginx
print_status "Installing nginx..."
apt-get install -y nginx

# Create application directories
print_status "Creating application directories..."
mkdir -p /var/www/pchr-frontend
mkdir -p /var/www/pchr-frontend-dev
mkdir -p /var/log/pchr-frontend
mkdir -p /var/log/pchr-frontend-dev
mkdir -p /var/log/pm2

# Create www-data user if it doesn't exist
if ! id "www-data" &>/dev/null; then
    print_status "Creating www-data user..."
    useradd -r -s /bin/false www-data
fi

# Set permissions
print_status "Setting permissions..."
chown -R www-data:www-data /var/www/pchr-frontend
chown -R www-data:www-data /var/www/pchr-frontend-dev
chown -R www-data:www-data /var/log/pchr-frontend
chown -R www-data:www-data /var/log/pchr-frontend-dev
chmod -R 755 /var/www/pchr-frontend
chmod -R 755 /var/www/pchr-frontend-dev

# Configure nginx for development
print_status "Configuring nginx for development..."
cat > /etc/nginx/sites-available/pchr-frontend-dev << 'EOF'
server {
    listen 80;
    server_name dev.pchr.org localhost;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Configure nginx for production
print_status "Configuring nginx for production..."
cat > /etc/nginx/sites-available/pchr-frontend << 'EOF'
server {
    listen 80;
    server_name pchr.org www.pchr.org;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable sites
print_status "Enabling nginx sites..."
ln -sf /etc/nginx/sites-available/pchr-frontend-dev /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/pchr-frontend /etc/nginx/sites-enabled/

# Remove default nginx site
rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
print_status "Testing nginx configuration..."
nginx -t

# Start and enable services
print_status "Starting and enabling services..."
systemctl start nginx
systemctl enable nginx
systemctl start pm2-www-data
systemctl enable pm2-www-data

# Configure PM2 startup
print_status "Configuring PM2 startup..."
sudo -u www-data pm2 startup systemd -u www-data --hp /var/www

# Create environment file template
print_status "Creating environment file template..."
cat > /etc/environment << 'EOF'
# PCHR Frontend Environment Variables
# Add your environment variables here
# Example:
# NEXT_PUBLIC_API_URL=https://api.pchr.org
# NEXT_PUBLIC_APP_URL=https://pchr.org
EOF

print_status "🎉 Server setup completed successfully!"
print_warning "Please configure the following:"
print_warning "1. Update /etc/environment with your environment variables"
print_warning "2. Configure SSL certificates for production"
print_warning "3. Set up firewall rules"
print_warning "4. Configure domain DNS records"
print_warning "5. Test the deployment with the deployment scripts"
