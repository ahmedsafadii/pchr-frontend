module.exports = {
  apps: [
    {
      name: "pchr-frontend-dev",
      script: "npm",
      args: "start",
      cwd: "/var/www/pchr-frontend-dev/current",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
        PORT: 3001,
        NEXT_PUBLIC_APP_ENV: "development",
      },
      env_development: {
        NODE_ENV: "development",
        PORT: 3001,
        NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || "development",
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "https://api-portal-dev.pchrgaza.org",
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api-portal-dev.pchrgaza.org/api/v1",
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "https://portal-dev.pchrgaza.org",
        NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN || "pchrgaza.org",
        NEXT_PUBLIC_ENABLE_DEBUG: process.env.NEXT_PUBLIC_ENABLE_DEBUG || "true",
        NEXT_PUBLIC_LOG_LEVEL: process.env.NEXT_PUBLIC_LOG_LEVEL || "debug",
      },
      error_file: "/var/log/pm2/pchr-frontend-dev-error.log",
      out_file: "/var/log/pm2/pchr-frontend-dev-out.log",
      log_file: "/var/log/pm2/pchr-frontend-dev-combined.log",
      time: true,
      merge_logs: true, // Merge stdout and stderr
      log_date_format: "YYYY-MM-DD HH:mm:ss Z", // Better timestamp format
      restart_delay: 1000,
      min_uptime: "10s",
      max_restarts: 10,
      kill_timeout: 5000,
      // Enhanced error handling
      exp_backoff_restart_delay: 100, // Exponential backoff for restarts
      // Removed wait_ready and listen_timeout as Next.js doesn't emit ready signal
    },
  ],
};
