module.exports = {
  apps: [
    {
      name: "nextapp",
      script: "npm",
      args: "start",
      cwd: "/var/www/nextapp",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "/var/log/pm2/nextapp-error.log",
      out_file: "/var/log/pm2/nextapp-out.log",
      log_file: "/var/log/pm2/nextapp-combined.log",
      time: true,
    },
  ],
};
