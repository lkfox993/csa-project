module.exports = {
  apps: [
    {
      name: 'csa-project',
      exec_mode: 'cluster',
      instances: 'max', // Or a number of instances
      script: 'npm',
      args: 'start'
    }
  ]
}
