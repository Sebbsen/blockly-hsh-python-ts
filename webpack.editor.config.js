const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Webpack-Konfiguration speziell für den Map Editor
const config = {
  entry: './src/map-editor/demo.ts',
  output: {
    filename: 'map-editor.js',
    path: path.resolve(__dirname, 'dist-editor'),
    clean: true,
  },
  devServer: {
    static: './dist-editor',
    port: 3001, // Anderer Port als das Hauptprojekt
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/map-editor/demo.html',
      filename: 'index.html',
    }),
  ],
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.output.path = path.resolve(__dirname, 'build-editor');
    config.devtool = 'eval-cheap-module-source-map';
  }
  return config;
};
