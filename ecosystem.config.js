module.exports = {
  apps: [
    {
      name: "pulse-server",
      script: "./server.js",

      // Instance configuration
      instances: process.env.PM2_INSTANCES || 2,
      exec_mode: "cluster",

      // Environment variables
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },

      // Logging
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      error_file: "./logs/error.log",
      out_file: "./logs/out.log",
      merge_logs: true,
      log_type: "json",

      // Advanced features
      watch: false,
      ignore_watch: ["node_modules", "logs", "tests"],

      // Restart behavior
      max_memory_restart: "500M",
      min_uptime: "10s",
      max_restarts: 10,
      autorestart: true,

      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,

      // Health checks
      health_check: {
        enabled: true,
        interval: 30000, // 30 seconds
        path: "/health",
      },

      // Source map support
      source_map_support: true,

      // Advanced options
      instance_var: "INSTANCE_ID",

      // Exponential backoff restart delay
      exp_backoff_restart_delay: 100,

      // Post-deploy hooks
      post_update: ["npm install --production", 'echo "Application updated"'],

      // Error handling
      combine_logs: true,

      // Time before forcing a reload
      reload_delay: 0,

      // Monitoring
      pmx: true,
      automation: false,

      // Additional metadata
      version: process.env.DEPLOY_VERSION || "1.0.0",
      node_args: ["--max-old-space-size=2048", "--experimental-vm-modules"],
    },
  ],

  // Deployment configuration
  deploy: {
    production: {
      user: process.env.DEPLOY_USER || "deploy",
      host: process.env.DEPLOY_HOST || "localhost",
      ref: "origin/main",
      repo: "git@github.com:NelakaWith/pulse-server.git",
      path: "/var/www/pulse-server",
      "post-deploy":
        "npm install --production && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "mkdir -p /var/www/pulse-server/logs",
    },
    staging: {
      user: process.env.DEPLOY_USER || "deploy",
      host: process.env.DEPLOY_HOST || "localhost",
      ref: "origin/develop",
      repo: "git@github.com:NelakaWith/pulse-server.git",
      path: "/var/www/pulse-server-staging",
      "post-deploy":
        "npm install && pm2 reload ecosystem.config.js --env development",
      "pre-setup": "mkdir -p /var/www/pulse-server-staging/logs",
    },
  },
};
