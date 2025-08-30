const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (_, argv) => {
  const isProd = argv.mode === 'production';

  return {
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'app.js',
      publicPath: '/', // needed for React Router
      clean: true,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          }
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.svg$/i,
          type: 'asset/resource',
          generator: {
            filename: 'logo.svg' // force output name
          }
        }
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        filename: 'index.html',
        inject: 'body'
      }),
      new MiniCssExtractPlugin({
        filename: 'styles.css'
      }),
      // Only copy the logo into dist. Deliberately DO NOT copy data.json
      // to keep dist with exactly 4 files as requested.
      new CopyWebpackPlugin({
        patterns: [
          { from: 'src/assets/logo.svg', to: 'logo.svg' }
        ]
      })
    ],
    devServer: {
      port: 5173,
      static: [
        // Serve project root so /data.json is available in dev only.
        { directory: path.join(__dirname), watch: true },
      ],
      historyApiFallback: true,
      hot: true
    },
    devtool: isProd ? 'source-map' : 'eval-cheap-module-source-map',
    mode: isProd ? 'production' : 'development',
    performance: {
      hints: false
    }
  };
};
