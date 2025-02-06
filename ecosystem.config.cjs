module.exports = {
  apps: [{
    name: 'dcf-backend',
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
    }
  }]
}