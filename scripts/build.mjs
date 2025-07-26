// Example of improved build script structure
import esbuild from 'esbuild';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const config = {
  entryPoints: ['./src/index.tsx'],
  outdir: './dist',
  bundle: true,
  minify: process.env.NODE_ENV === 'production',
  sourcemap: process.env.NODE_ENV !== 'production',
  target: ['es2020'],
  platform: 'browser',
  loader: {
    '.tsx': 'tsx',
    '.ts': 'ts',
  },
  jsx: 'automatic',
  // Add more configuration options
};

// Build function with error handling
async function build() {
  console.log('🚀 Starting build process...');
  const startTime = Date.now();

  try {
    // Clean dist directory
    await fs.rm(config.outdir, { recursive: true, force: true });
    await fs.mkdir(config.outdir, { recursive: true });

    // Run esbuild
    const result = await esbuild.build({
      ...config,
      metafile: true,
    });

    // Copy static assets
    await copyStaticAssets();

    // Generate build report
    const buildTime = Date.now() - startTime;
    console.log(`✅ Build completed in ${buildTime}ms`);
    
    // Analyze bundle size
    const text = await esbuild.analyzeMetafile(result.metafile);
    console.log(text);

  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// Helper function to copy static assets
async function copyStaticAssets() {
  // Copy public directory contents to dist
  try {
    await fs.cp('./public', config.outdir, { recursive: true });
    console.log('📁 Static assets copied');
  } catch (error) {
    console.warn('⚠️  No public directory found or failed to copy static assets:', error.message);
  }
}

// Run build
build();