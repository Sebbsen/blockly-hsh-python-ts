const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const levelManifest = require('./src/level/manifest.json');

const htmlPages = [
  {filename: 'index.html'},
  {filename: 'overview/index.html'},
  {filename: 'editor/index.html'},
  ...levelManifest.map((level) => ({filename: `${level.slug}/index.html`})),
];

// Base config that applies to either development or production mode.
const config = {
  entry: './src/index.ts',
  output: {
    // Compile the source files into a bundle.
    filename: 'bundle.js',
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  // Enable webpack-dev-server to get hot refresh of the app.
  devServer: {
    static: './build',
    historyApiFallback: {
      rewrites: [
        {from: /^\/overview\/?$/, to: '/overview/index.html'},
        {from: /^\/editor\/?$/, to: '/editor/index.html'},
        ...levelManifest.map((level) => ({
          from: new RegExp(`^/${level.slug}/?$`),
          to: `/${level.slug}/index.html`,
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
    ...htmlPages.map((page) => new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: page.filename,
    })),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/level/manifest.json'),
          to: 'level/manifest.json',
        },
        ...levelManifest.map((level) => ({
          from: path.resolve(__dirname, `src/level/${level.source || level.file}`),
          to: `level/${level.file}`,
        })),
      ],
    }),
  ],
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
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

  if (argv.mode === 'production') {
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
