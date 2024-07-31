const path = require('path');
const PugPlugin = require('pug-plugin');

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
  mode: "production", 
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    hot: true,
    open: true,
    
  },
  stats: {
    children: false,
    modulesSpace: 0,
  },
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, 'dist/'),
    assetModuleFilename: "assets/[hash][ext][query]",
    clean: true,
  },

  entry: {
    // define Pug files here
    index: './src/index.pug', // => dist/index.html
  },

  plugins: [
    new PugPlugin({
      js: {
        filename: 'js/[name].[contenthash:8].js', // output filename of JS
      },
      css: {
        filename: 'css/[name].[contenthash:8].css', // output filename of CSS
      },
    }),
  ],

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: PugPlugin.loader,
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: ['css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|)$/i,
        type: 'asset/resource',
      
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|)$/i,
        type: 'asset/resource',
      },
    ],
  },
};
