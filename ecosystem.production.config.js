module.exports = {
  apps: [
    {
      name: "pchr-frontend",
      script: "npm",
      args: "start",
      cwd: "/var/www/pchr-frontend/current",
      instances: 2, // Run 2 instances for better reliability
      autorestart: true,
      watch: false,
      max_memory_restart: "2G", // Increased memory limit
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        NEXT_PUBLIC_APP_ENV: "production",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        NEXT_PUBLIC_APP_ENV: "production",
        NEXT_PUBLIC_API_URL: "https://api.pchr.org",
        NEXT_PUBLIC_APP_URL: "https://pchr.org",
        NEXT_PUBLIC_ENABLE_DEBUG: "false",
        NEXT_PUBLIC_LOG_LEVEL: "error",
        NEXT_PUBLIC_ENABLE_ANALYTICS: "true",
      },
      error_file: "/var/log/pm2/pchr-frontend-error.log",
      out_file: "/var/log/pm2/pchr-frontend-out.log",
      log_file: "/var/log/pm2/pchr-frontend-combined.log",
      time: true,
      restart_delay: 2000, // Wait 2 seconds before restart
      min_uptime: "30s", // App must run for 30s before considered stable
      max_restarts: 15, // Allow more restarts
      kill_timeout: 5000, // Give app 5s to shutdown gracefully
      wait_ready: true, // Wait for app to be ready
      listen_timeout: 10000, // Wait 10s for app to start listening
    },
  ],
};
