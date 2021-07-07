process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.TARGET = process.env.TARGET || 'web';

console.log(`TARGET: ${process.env.TARGET}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';
const isWeb = process.env.TARGET === 'web';
const isNode = process.env.TARGET === 'node';
const target = process.env.TARGET;

const appConfig = require('./src/config.js');
const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

// For SSR
const LoadablePlugin = require('@loadable/webpack-plugin');

let config = {
  name: target,
  target: target,
  mode: process.env.NODE_ENV, // https://webpack.js.org/configuration/mode/
  context: path.join(__dirname, '/src'),
  entry: `index.${target}.js`,
  output: {
    path: path.join(__dirname, 'dist', target),
    filename: '[name].js', //'[name]-bundle-[chunkhash:8].js'
    // publicPath: `/dist/${target}/`,
    // pathinfo: true
    libraryTarget: isNode ? 'commonjs2' : undefined,
    library: 'ExserAdmin',
    clean: true,
  },
  plugins: [
    new ProgressBarPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        TARGET: JSON.stringify(process.env.TARGET),
        IS_WEB: process.env.TARGET === 'web',
        IS_NODE: process.env.TARGET === 'node',
      },
    }),
    new LoadablePlugin(),
    new MiniCssExtractPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    alias: {
      '@src': path.resolve(__dirname, './src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [{ loader: 'babel-loader' }],
      },
      {
        test: /\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader, options: {} },
          //{ loader: 'style-loader' },
          { loader: 'css-loader', options: { url: true, import: true } },
        ],
      },
      {
        test: /\.less$/,
        use: [
          { loader: MiniCssExtractPlugin.loader, options: {} },
          //{ loader: 'style-loader' },
          { loader: 'css-loader', options: { url: true, import: true } },
          { loader: 'less-loader', options: { lessOptions: {} } },
        ],
      },
      {
        test: /\.(svg|png|swf|jpg|otf|eot|ttf|woff|woff2)(\?.*)?$/,
        use: [
          { loader: 'url-loader', options: { limit: 1000, name: 'assets/[contenthash].[ext]' } },
        ],
      },
      {
        test: /\.jsx\.svg$/,
        use: [
          { loader: 'babel-loader' },
          { loader: 'react-svg-loader', options: { jsx: true /*true outputs JSX tags*/ } },
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: {
                removeComments: false,
              },
            },
          },
        ],
      },
    ],
  },
  stats: {
    colors: true,
    hash: false,
    version: false,
    timings: false,
    assets: isWeb,
    chunks: false,
    modules: false,
    reasons: false,
    children: false,
    source: false,
    errors: true,
    errorDetails: true,
    warnings: true,
    publicPath: false,
  },
};

if (isWeb) {
  config.plugins.push(
    new HtmlWebPackPlugin({
      template: './index.html',
      filename: './index.html',
      title: 'App',
      base: appConfig.navigation.basename,
    }),
  );
}
// if (isNode) {
// }

if (isProduction) {
}

if (isDevelopment && isWeb) {
  config.devtool = 'inline-source-map'; // "#cheap-module-inline-source-map";
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.devServer = {
    //compress: false,
    static: path.join(__dirname, 'dist', target),
    port: appConfig.devServer.port,
    //publicPath: config.output.publicPath,
    //hot: true,
    historyApiFallback: true,
    proxy: appConfig.api.proxy,
  };
}

if (process.env.BUILD_ANALYZE) {
  config.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = config;
