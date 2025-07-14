module.exports = {
  apps: [
    {
      name: "nextapp",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: "/var/www/nextapp",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
