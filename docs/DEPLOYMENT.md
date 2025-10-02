# PCHR Frontend Deployment Guide

This guide covers the deployment process for the PCHR Frontend application in both development and production environments.

## Overview

The PCHR Frontend supports two deployment environments:

- **Development Environment**: For testing and development purposes
- **Production Environment**: For live production use

## Prerequisites

### Server Requirements

- Ubuntu 20.04+ or similar Linux distribution
- Node.js 20+
- PM2 for process management
- Nginx for reverse proxy
- Git for code deployment

### Required GitHub Secrets

For automated deployment via GitHub Actions, configure the following secrets:

#### Development Environment
- `DEVELOPMENT_HOST` - Development server hostname/IP
- `DEVELOPMENT_USER` - SSH username for development server
- `DEVELOPMENT_SSH_KEY` - SSH private key for development server

#### Production Environment
- `SERVER_HOST` - Production server hostname/IP
- `SERVER_USER` - SSH username for production server
- `SERVER_SSH_KEY` - SSH private key for production server

## Automated Deployment (Recommended)

### GitHub Actions Workflow

The project uses GitHub Actions for automated deployment:

1. **Development Deployment**: Triggered by pushes to `develop` branch
2. **Production Deployment**: Triggered by pushes to `main` branch
3. **Manual Deployment**: Can be triggered manually via GitHub Actions UI

### Workflow Steps

1. **Code Quality Check**: Runs ESLint and TypeScript checks
2. **Build**: Creates production build of the application
3. **Deploy**: Deploys to the appropriate environment
4. **Health Check**: Verifies the deployment is working
5. **Cleanup**: Removes old releases (production only)

## Manual Deployment

### Server Setup

1. **Initial Server Setup**:
   ```bash
   sudo bash scripts/setup-server.sh
   ```

2. **Configure Environment Variables**:
   Edit `/etc/environment` with your environment-specific variables:
   ```bash
   sudo nano /etc/environment
   ```

3. **Set up SSL Certificates** (Production only):
   ```bash
   sudo certbot --nginx -d pchr.org -d www.pchr.org
   ```

### Development Deployment

1. **SSH into Development Server**:
   ```bash
   ssh user@dev-server
   ```

2. **Navigate to Project Directory**:
   ```bash
   cd /var/www/pchr-frontend-dev
   ```

3. **Run Deployment Script**:
   ```bash
   sudo bash scripts/deploy-development.sh
   ```

### Production Deployment

1. **SSH into Production Server**:
   ```bash
   ssh user@prod-server
   ```

2. **Navigate to Project Directory**:
   ```bash
   cd /var/www/pchr-frontend
   ```

3. **Run Deployment Script**:
   ```bash
   sudo bash scripts/deploy-production.sh
   ```

## Environment Configuration

### Development Environment

- **Port**: 3001
- **Domain**: dev.pchr.org or localhost
- **API URL**: http://localhost:8000
- **Debug Mode**: Enabled
- **Log Level**: Debug

### Production Environment

- **Port**: 3000
- **Domain**: pchr.org
- **API URL**: https://api.pchr.org
- **Debug Mode**: Disabled
- **Log Level**: Error

## PM2 Process Management

### Development
```bash
# Start development application
pm2 start ecosystem.development.config.js --env development

# View logs
pm2 logs pchr-frontend-dev

# Restart application
pm2 restart pchr-frontend-dev

# Stop application
pm2 stop pchr-frontend-dev
```

### Production
```bash
# Start production application
pm2 start ecosystem.production.config.js --env production

# View logs
pm2 logs pchr-frontend

# Restart application
pm2 restart pchr-frontend

# Stop application
pm2 stop pchr-frontend
```

## Nginx Configuration

### Development
- **Config File**: `/etc/nginx/sites-available/pchr-frontend-dev`
- **Proxy Target**: `http://localhost:3001`
- **Server Name**: `dev.pchr.org localhost`

### Production
- **Config File**: `/etc/nginx/sites-available/pchr-frontend`
- **Proxy Target**: `http://localhost:3000`
- **Server Name**: `pchr.org www.pchr.org`

## Monitoring and Logs

### Application Logs
- **Development**: `/var/log/pm2/pchr-frontend-dev-*.log`
- **Production**: `/var/log/pm2/pchr-frontend-*.log`

### Nginx Logs
- **Access Log**: `/var/log/nginx/access.log`
- **Error Log**: `/var/log/nginx/error.log`

### PM2 Monitoring
```bash
# View PM2 status
pm2 status

# View PM2 monitoring
pm2 monit

# View PM2 logs
pm2 logs
```

## Troubleshooting

### Common Issues

1. **Application Not Starting**:
   - Check PM2 status: `pm2 status`
   - View logs: `pm2 logs pchr-frontend`
   - Check port availability: `netstat -tlnp | grep :3000`

2. **Nginx 502 Bad Gateway**:
   - Check if application is running: `pm2 status`
   - Check nginx configuration: `nginx -t`
   - Restart nginx: `sudo systemctl restart nginx`

3. **Build Failures**:
   - Check Node.js version: `node --version`
   - Clear npm cache: `npm cache clean --force`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

### Health Checks

1. **Application Health**:
   ```bash
   curl -f http://localhost:3000/
   ```

2. **API Connectivity**:
   ```bash
   curl -f http://localhost:8000/api/health/
   ```

## Security Considerations

### Production Security

1. **Firewall Configuration**:
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

2. **SSL/TLS Configuration**:
   - Use Let's Encrypt for SSL certificates
   - Enable HSTS headers
   - Configure secure ciphers

3. **Environment Variables**:
   - Never commit sensitive data to version control
   - Use GitHub Secrets for CI/CD
   - Store production secrets securely

## Backup and Recovery

### Backup Strategy

1. **Code Backups**: Git repository serves as primary backup
2. **Configuration Backups**: Backup `/etc/environment` and nginx configs
3. **Log Backups**: Rotate and archive application logs

### Recovery Process

1. **Code Recovery**: Clone from Git repository
2. **Configuration Recovery**: Restore from backups
3. **Application Recovery**: Run deployment scripts

## Performance Optimization

### Production Optimizations

1. **PM2 Configuration**:
   - Multiple instances for load balancing
   - Memory limits and restart policies
   - Log rotation and management

2. **Nginx Configuration**:
   - Gzip compression
   - Static file caching
   - Connection pooling

3. **Application Configuration**:
   - Production build optimizations
   - Image optimization
   - Code splitting

## Maintenance

### Regular Maintenance Tasks

1. **Weekly**:
   - Check application logs for errors
   - Monitor system resources
   - Update dependencies if needed

2. **Monthly**:
   - Review and rotate logs
   - Update system packages
   - Performance monitoring

3. **Quarterly**:
   - Security updates
   - Dependency updates
   - Performance optimization review

## Support

For deployment issues or questions:

1. Check the troubleshooting section above
2. Review application and system logs
3. Contact the development team
4. Create an issue in the project repository

---

**Last Updated**: [Current Date]
**Version**: 1.0.0
