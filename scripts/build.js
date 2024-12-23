const esbuild = require('esbuild')

async function buildServer() {
  try {
    console.log('Starting server build...')

    await esbuild.build({
      entryPoints: ['src/server/index.ts'],
      bundle: true,
      platform: 'node',
      target: 'node14',
      outfile: 'dist/server/index.js',
      sourcemap: true,
      format: 'cjs',
      logLevel: 'info',
    })

    console.log('Server build completed successfully!')
  } catch (error) {
    console.error('Build failed:', error)
    process.exit(1)
  }
}

buildServer()
