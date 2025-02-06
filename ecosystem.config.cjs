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
      NODE_NO_WARNINGS: '1'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
      NODE_NO_WARNINGS: '1'
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
    pm2_plus: true,
    wait_ready: true,
    listen_timeout: 3000,
    kill_timeout: 5000,
    max_restarts: 10,
    min_uptime: "30s"
  }]
}