module.exports = {
  apps: [{
    name: process.env.PM2_MACHINE_NAME || 'dcf-backend',
    script: './index.ts',
    interpreter: 'tsx',
    exec_mode: 'fork',
    watch: false,
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      NODE_NO_WARNINGS: '1'
    },
    instances: 1,
    merge_logs: true,
    pmx: true,
    trace: true
  }]
}