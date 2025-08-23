#!/bin/bash

# PM2 Troubleshooting Script
# Run this on your Ubuntu server to diagnose PM2 issues

echo "🔍 PM2 Troubleshooting Script"
echo "=============================="

# Check if PM2 is installed
echo "1. Checking PM2 installation..."
if command -v pm2 &> /dev/null; then
    echo "✅ PM2 is installed: $(pm2 --version)"
else
    echo "❌ PM2 is not installed"
    echo "   Install with: npm install -g pm2"
    exit 1
fi

# Check PM2 status
echo -e "\n2. Current PM2 status:"
pm2 status

# Check if PM2 service is enabled
echo -e "\n3. Checking PM2 service status..."
if systemctl is-enabled pm2-$USER.service >/dev/null 2>&1; then
    echo "✅ PM2 service is enabled"
    sudo systemctl status pm2-$USER.service --no-pager -l
else
    echo "❌ PM2 service is not enabled"
    echo "   Run: pm2 startup"
    echo "   Then run the displayed sudo command"
    echo "   Finally run: pm2 save"
fi

# Check application directory
echo -e "\n4. Checking application directory..."
if [ -d "/var/www/nextapp" ]; then
    echo "✅ Application directory exists"
    cd /var/www/nextapp
    
    if [ -f "package.json" ]; then
        echo "✅ package.json found"
    else
        echo "❌ package.json not found"
    fi
    
    if [ -d ".next" ]; then
        echo "✅ .next build directory found"
    else
        echo "❌ .next build directory not found - run 'npm run build'"
    fi
    
    if [ -d "node_modules" ]; then
        echo "✅ node_modules directory found"
    else
        echo "❌ node_modules not found - run 'npm install'"
    fi
else
    echo "❌ Application directory /var/www/nextapp not found"
    exit 1
fi

# Check ecosystem config
echo -e "\n5. Checking ecosystem configuration..."
if [ -f "ecosystem.config.js" ]; then
    echo "✅ ecosystem.config.js found"
    echo "Configuration preview:"
    head -20 ecosystem.config.js
else
    echo "❌ ecosystem.config.js not found"
fi

# Check logs
echo -e "\n6. Recent PM2 logs (last 20 lines)..."
if pm2 list | grep -q "nextapp"; then
    pm2 logs nextapp --lines 20
else
    echo "❌ No nextapp process found in PM2"
fi

# Check log files
echo -e "\n7. Checking log files..."
if [ -d "/var/log/pm2" ]; then
    echo "✅ PM2 log directory exists"
    ls -la /var/log/pm2/
    
    if [ -f "/var/log/pm2/nextapp-error.log" ]; then
        echo -e "\n📄 Last 10 lines of error log:"
        tail -10 /var/log/pm2/nextapp-error.log
    fi
else
    echo "❌ PM2 log directory not found"
fi

# Check port availability
echo -e "\n8. Checking if port 3000 is available..."
if netstat -tuln | grep -q ":3000 "; then
    echo "⚠️  Port 3000 is already in use:"
    netstat -tuln | grep ":3000 "
    echo "   Process using port 3000:"
    lsof -i :3000 || echo "   Could not determine process"
else
    echo "✅ Port 3000 is available"
fi

# Check Node.js version
echo -e "\n9. Node.js version:"
node --version

# Check npm version
echo -e "\n10. npm version:"
npm --version

# Suggested actions
echo -e "\n🔧 Suggested Actions:"
echo "====================="

if ! pm2 list | grep -q "nextapp.*online"; then
    echo "1. Try starting the app manually:"
    echo "   cd /var/www/nextapp"
    echo "   pm2 start ecosystem.config.js"
    echo ""
    echo "2. If that fails, try the npm version:"
    echo "   pm2 start ecosystem.npm.config.js"
    echo ""
    echo "3. Check logs for specific errors:"
    echo "   pm2 logs nextapp"
    echo ""
    echo "4. Test Next.js directly:"
    echo "   npm start"
    echo ""
fi

if ! systemctl is-enabled pm2-$USER.service >/dev/null 2>&1; then
    echo "5. Set up PM2 as a service:"
    echo "   pm2 startup"
    echo "   # Run the sudo command it shows"
    echo "   pm2 save"
    echo "   sudo systemctl enable pm2-$USER.service"
    echo ""
fi

echo "6. For immediate restart:"
echo "   pm2 restart nextapp"
echo ""
echo "7. For complete reset:"
echo "   pm2 delete nextapp"
echo "   pm2 start ecosystem.config.js"
echo "   pm2 save"

echo -e "\n✅ Troubleshooting complete!"
