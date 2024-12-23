module.exports = {
  apps: [
    {
      name: 'stackedit-app',
      script: './dist/server/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
}
