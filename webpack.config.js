const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = env => {
  return {
    entry: './src/index.js',
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist')
    },
    mode: env === 'production' ? 'production' : 'development',
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist'
    },
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          loaders: ['babel-loader'],
        },
        {
          test: /\.(ts)$/,
          exclude: /node_modules/,
          loaders: ['babel-loader', 'ts-loader'],
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                minimize: false,
              },
            },
            'sass-loader',
          ]
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'src/index.ejs'
      })
    ]
  }
}
