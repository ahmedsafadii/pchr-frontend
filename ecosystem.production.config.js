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
        NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || "production",
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "https://api-portal.pchrgaza.org",
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api-portal.pchrgaza.org/api",
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "https://portal.pchrgaza.org",
        NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN || "pchrgaza.org",
        NEXT_PUBLIC_ENABLE_DEBUG: process.env.NEXT_PUBLIC_ENABLE_DEBUG || "false",
        NEXT_PUBLIC_LOG_LEVEL: process.env.NEXT_PUBLIC_LOG_LEVEL || "error",
        NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS || "true",
        NEXT_PUBLIC_MAX_FILE_SIZE: process.env.NEXT_PUBLIC_MAX_FILE_SIZE || "10485760",
        NEXT_PUBLIC_ALLOWED_FILE_TYPES: process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES || "image/jpeg,image/png,image/gif,application/pdf",
        NEXT_PUBLIC_CACHE_TTL: process.env.NEXT_PUBLIC_CACHE_TTL || "3600",
      },
      error_file: "/var/log/pm2/pchr-frontend-error.log",
      out_file: "/var/log/pm2/pchr-frontend-out.log",
      log_file: "/var/log/pm2/pchr-frontend-combined.log",
      time: true,
      merge_logs: true, // Merge stdout and stderr
      log_date_format: "YYYY-MM-DD HH:mm:ss Z", // Better timestamp format
      restart_delay: 5000, // Wait 5 seconds before restart
      min_uptime: "10s", // App must run for 10s before considered stable
      max_restarts: 10, // Allow fewer restarts
      kill_timeout: 5000, // Give app 5s to shutdown gracefully
      // Enhanced error handling
      exp_backoff_restart_delay: 100, // Exponential backoff for restarts
      // Removed wait_ready and listen_timeout as Next.js doesn't emit ready signal
    },
  ],
};
