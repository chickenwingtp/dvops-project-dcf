module.exports = {
  apps: [{
    name: `dcf-backend-${process.env.NODE_ENV || 'production'}`,
    script: './index.ts',
    interpreter: 'node',
    interpreter_args: '--import tsx',
    exec_mode: 'fork',
    watch: true,
    env: {
      NODE_ENV: 'development',
      PORT: 3000,
      NODE_NO_WARNINGS: '1',
      PM2_PUBLIC_KEY: process.env.PM2_PUBLIC_KEY,
      PM2_PRIVATE_KEY: process.env.PM2_PRIVATE_KEY,
      PM2_MACHINE_NAME: process.env.PM2_MACHINE_NAME
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
      NODE_NO_WARNINGS: '1',
      PM2_PUBLIC_KEY: process.env.PM2_PUBLIC_KEY,
      PM2_PRIVATE_KEY: process.env.PM2_PRIVATE_KEY,
      PM2_MACHINE_NAME: process.env.PM2_MACHINE_NAME
    },
    instances: 1,
    merge_logs: true,
    post_update: ["npm install"],
    monitoring: {
      transaction: true,
      http: true,
      custom_probes: true,
    },
    instance_var: 'INSTANCE_ID',
    pmx: true,
    trace: true,
    deep_monitoring: true,
    pm2_plus: {
      retry_timeout: 10000,
      retry_attempts: 5
    },
    automation: false,
    increment_var: 'PM2_INSTANCE_ID',
    wait_ready: true,
    listen_timeout: 3000,
    kill_timeout: 5000,
    max_restarts: 10,
    min_uptime: "30s"
  }]
}