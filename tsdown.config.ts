import { defineConfig } from 'tsdown'
import pkg from './package.json'

export default defineConfig({
  entry: {
    hooks: 'src/hooks/index.ts',
    utils: 'src/utils/index.ts',
    predicates: 'src/predicates/index.ts',
    // resolvers: 'src/resolvers/index.ts',
  },
  clean: true,
  sourcemap: true,
  dts: true,
  format: ['esm'],
  outDir: 'dist',
  define: {
    'import.meta.vitest': 'undefined',
  },
  target: 'esnext',
  platform: 'neutral',
  outExtensions: ctx => {
    if (ctx.format === 'es') {
      return { js: '.js', dts: '.ts' }
    }
    return {}
  },
  external: [
    // regex for "node:*" imports
    /^node:.*/,
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.devDependencies),
  ],
  treeshake: true,
  unused: true,
})
