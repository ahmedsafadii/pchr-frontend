# PM2 Service Setup Guide

This guide explains how to set up PM2 as a system service on Ubuntu to ensure your Next.js application automatically starts on boot and stays running.

## Problem

When using GitHub Actions to deploy with PM2, the application might not restart properly or stay running after server reboots because PM2 isn't configured as a system service.

## Solution

Set up PM2 as a systemd service that automatically starts on boot and manages your application lifecycle.

## Quick Setup

### Option 1: Automatic Setup (Recommended)

Run the provided setup script on your Ubuntu server:

```bash
# On your Ubuntu server
cd /var/www/nextapp
./deploy-setup.sh
```

Follow the instructions displayed by the script.

### Option 2: Manual Setup

#### 1. Install PM2 globally (if not already installed)

```bash
npm install -g pm2
```

#### 2. Create log directory

```bash
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2
```

#### 3. Install PM2 log rotation

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true
```

#### 4. Setup PM2 startup script

```bash
pm2 startup
```

This will display a command like:
```bash
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME
```

**Copy and run that exact command with sudo.**

#### 5. Start your application

```bash
cd /var/www/nextapp
pm2 start ecosystem.config.js
```

#### 6. Save PM2 configuration

```bash
pm2 save
```

#### 7. Enable and start the service

```bash
sudo systemctl enable pm2-$USER.service
sudo systemctl start pm2-$USER.service
```

## Verification

### Check if PM2 service is running:

```bash
sudo systemctl status pm2-$USER.service
```

### Check PM2 processes:

```bash
pm2 status
```

### Check if service starts on boot:

```bash
sudo systemctl is-enabled pm2-$USER.service
```

Should return: `enabled`

## Configuration Files

### ecosystem.config.js

The updated configuration includes:

- **autorestart**: Automatically restart if the app crashes
- **max_memory_restart**: Restart if memory usage exceeds 1GB
- **Logging**: Centralized logs in `/var/log/pm2/`
- **Time stamps**: Add timestamps to logs

### GitHub Actions Workflow

The updated workflow (`.github/workflows/deploy.yml`) now:

- Sets up PM2 as a system service automatically
- Creates necessary directories
- Saves PM2 configuration after deployment
- Verifies the service is running

## Useful Commands

### PM2 Management
```bash
pm2 status              # Check running processes
pm2 logs                # View real-time logs
pm2 logs nextapp        # View logs for specific app
pm2 restart nextapp     # Restart specific app
pm2 reload nextapp      # Zero-downtime reload
pm2 stop nextapp        # Stop specific app
pm2 delete nextapp      # Remove app from PM2
```

### Service Management
```bash
sudo systemctl status pm2-$USER.service    # Check service status
sudo systemctl restart pm2-$USER.service   # Restart PM2 service
sudo systemctl stop pm2-$USER.service      # Stop PM2 service
sudo systemctl start pm2-$USER.service     # Start PM2 service
```

### Save/Restore Configuration
```bash
pm2 save                # Save current process list
pm2 resurrect           # Restore saved processes
pm2 unstartup           # Remove startup script
```

## Troubleshooting

### Service not starting on boot

1. Check if service is enabled:
   ```bash
   sudo systemctl is-enabled pm2-$USER.service
   ```

2. If not enabled, enable it:
   ```bash
   sudo systemctl enable pm2-$USER.service
   ```

### Application not restarting after crash

1. Check PM2 status:
   ```bash
   pm2 status
   ```

2. Check logs for errors:
   ```bash
   pm2 logs nextapp
   ```

3. Restart the application:
   ```bash
   pm2 restart nextapp
   ```

### GitHub Actions deployment failing

1. Check if the user has sudo privileges on the server
2. Verify PM2 is installed globally
3. Check server logs for specific error messages

## Log Files

- **Application logs**: `/var/log/pm2/nextapp-*.log`
- **PM2 service logs**: `sudo journalctl -u pm2-$USER.service`
- **System logs**: `/var/log/syslog`

## Security Notes

- The setup script creates logs directory with proper permissions
- PM2 runs under your user account, not root
- Log rotation is configured to prevent disk space issues
- Service is configured to start only after network is available

## Benefits of This Setup

1. **Auto-start on boot**: Application starts automatically when server reboots
2. **Auto-restart on crash**: PM2 automatically restarts if the application crashes
3. **Memory management**: Restarts if memory usage gets too high
4. **Log management**: Centralized logging with automatic rotation
5. **Zero-downtime deployments**: Use `pm2 reload` for seamless updates
6. **Process monitoring**: Built-in monitoring and status reporting
