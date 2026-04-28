const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const liveLevelManifest = require('./src/level/live/manifest.json');
const testLevelManifest = require('./src/level/test/manifest.json');

const withSourcePath = (levels, sourceDir) => levels.map((level) => ({
  ...level,
  sourcePath: path.resolve(__dirname, sourceDir, level.source || level.file),
}));

const getLevelManifest = (mode) => {
  const liveLevels = withSourcePath(liveLevelManifest, 'src/level/live');
  if (mode === 'production') return liveLevels;

  return [
    ...liveLevels,
    ...withSourcePath(testLevelManifest, 'src/level/test'),
  ];
};

const getManifestAsset = (mode) => {
  const levels = mode === 'production'
    ? liveLevelManifest
    : [
      ...liveLevelManifest.map((level) => ({...level, group: 'live'})),
      ...testLevelManifest.map((level) => ({...level, group: 'test'})),
    ];

  return JSON.stringify(levels, null, 2);
};

module.exports = (env, argv) => {
  const mode = argv.mode === 'production' ? 'production' : 'development';
  const levelManifest = getLevelManifest(mode);
  const htmlPages = [
    {filename: 'index.html'},
    {filename: 'overview.html'},
    {filename: 'editor.html'},
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
      historyApiFallback: {
        rewrites: [
          {from: /^\/overview\/?$/, to: '/overview.html'},
          {from: /^\/editor\/?$/, to: '/editor.html'},
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
        TEST_LEVEL_MANIFEST: JSON.stringify(mode === 'production' ? [] : testLevelManifest),
      }),
      ...htmlPages.map((page) => new HtmlWebpackPlugin({
        template: 'src/index.html',
        filename: page.filename,
      })),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, mode === 'production'
              ? 'src/level/live/manifest.json'
              : 'src/level/test/manifest.json'),
            to: 'manifest.json',
            transform: () => getManifestAsset(mode),
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
