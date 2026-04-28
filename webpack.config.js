const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const levelDirs = {
  live: path.resolve(__dirname, 'src/level/live'),
  test: path.resolve(__dirname, 'src/level/test'),
};

const titleFromSlug = (slug) => slug
  .split('-')
  .filter(Boolean)
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join(' ');

const getLevelTitle = (levelData, slug) => {
  const rawTitle = levelData.title || levelData.name;
  return typeof rawTitle === 'string' && rawTitle.trim()
    ? rawTitle.trim()
    : titleFromSlug(slug);
};

const scanLevelDir = (group) => {
  const dir = levelDirs[group];
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir)
    .filter((fileName) => fileName.endsWith('.json'))
    .sort((a, b) => a.localeCompare(b, undefined, {numeric: true}))
    .map((fileName) => {
      const sourcePath = path.join(dir, fileName);
      const slug = path.basename(fileName, '.json');
      const levelData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
      return {
        slug,
        title: getLevelTitle(levelData, slug),
        file: fileName,
        group,
        sourcePath,
      };
    });
};

const getLevelManifest = (mode) => {
  const liveLevels = scanLevelDir('live');
  if (mode === 'production') return liveLevels;

  return [
    ...liveLevels,
    ...scanLevelDir('test'),
  ];
};

const getManifestAsset = (levels, mode) => {
  const manifestLevels = mode === 'production'
    ? levels.map(({slug, title, file}) => ({slug, title, file}))
    : levels.map(({slug, title, file, group}) => ({slug, title, file, group}));

  return JSON.stringify(manifestLevels, null, 2);
};

module.exports = (env, argv) => {
  const mode = argv.mode === 'production' ? 'production' : 'development';
  const levelManifest = getLevelManifest(mode);
  const htmlPages = [
    {filename: 'index.html'},
    {filename: 'overview.html'},
    ...(mode === 'development' ? [{filename: 'editor.html'}] : []),
    ...levelManifest.map((level) => ({filename: `${level.slug}.html`})),
  ];

  const config = {
    entry: './src/index.ts',
    output: {
      // Compile the source files into a bundle.
      filename: 'bundle.js',
      publicPath: '',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    // Enable webpack-dev-server to get hot refresh of the app.
    devServer: {
      static: './build',
      watchFiles: ['src/level/live/*.json', 'src/level/test/*.json'],
      historyApiFallback: {
        rewrites: [
          {from: /^\/overview\/?$/, to: '/overview.html'},
          ...(mode === 'development' ? [{from: /^\/editor\/?$/, to: '/editor.html'}] : []),
          ...levelManifest.map((level) => ({
            from: new RegExp(`^/${level.slug}/?$`),
            to: `/${level.slug}.html`,
          })),
        ],
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          // Load CSS files. They can be imported into JS files.
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
      new webpack.DefinePlugin({
        LEVEL_BUILD_TARGET: JSON.stringify(mode),
        LEVEL_MANIFEST: JSON.stringify(levelManifest.map(({slug, title, file, group}) => ({
          slug,
          title,
          file,
          group,
        }))),
      }),
      ...htmlPages.map((page) => new HtmlWebpackPlugin({
        template: 'src/index.html',
        filename: page.filename,
      })),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: levelManifest[0]?.sourcePath || path.resolve(__dirname, 'src/index.html'),
            to: 'manifest.json',
            transform: () => getManifestAsset(levelManifest, mode),
          },
          ...levelManifest.map((level) => ({
            from: level.sourcePath,
            to: level.file,
          })),
        ],
      }),
    ],
  };

  if (mode === 'development') {
    // Set the output path to the `build` directory
    // so we don't clobber production builds.
    config.output.path = path.resolve(__dirname, 'build');

    // Generate source maps for our code for easier debugging.
    // Not suitable for production builds. If you want source maps in
    // production, choose a different one from https://webpack.js.org/configuration/devtool
    config.devtool = 'eval-cheap-module-source-map';

    // Include the source maps for Blockly for easier debugging Blockly code.
    config.module.rules.push({
      test: /(blockly\/.*\.js)$/,
      use: [require.resolve('source-map-loader')],
      enforce: 'pre',
    });

    // Ignore spurious warnings from source-map-loader
    // It can't find source maps for some Closure modules and that is expected
    config.ignoreWarnings = [/Failed to parse source map/];
  }

  if (mode === 'production') {
    config.devtool = false;
    config.optimization = {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
        }),
      ],
    };
  }

  return config;
};
