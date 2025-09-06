module.exports = {
  apps: [
    {
      name: "nextapp",
      script: "npm",
      args: "start",
      cwd: "/var/www/nextapp",
      instances: 2, // Run 2 instances for better reliability
      autorestart: true,
      watch: false,
      max_memory_restart: "2G", // Increased memory limit
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "/var/log/pm2/nextapp-error.log",
      out_file: "/var/log/pm2/nextapp-out.log",
      log_file: "/var/log/pm2/nextapp-combined.log",
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
