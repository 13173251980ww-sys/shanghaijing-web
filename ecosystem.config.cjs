module.exports = {
  apps: [
    {
      name: 'shanghaijing-api',
      cwd: './apps/api',
      script: 'src/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      // 2C2G 小机器，保守配置
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '256M',
      // 日志
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '../logs/api-error.log',
      out_file: '../logs/api-out.log',
      merge_logs: true,
    },
  ],
};
