const { build } = require('esbuild');

build({
  entryPoints: ['./tsc_build/index.js'],
  outfile: './build/index.js',
  platform: 'node',
  bundle: true,
  minify: true,
  sourcemap: true,
  sourcesContent: false,
});
