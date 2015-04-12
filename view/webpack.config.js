module.exports = {
  entry: './index', // app entry point,
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel'], exclude: /node_modules|dist/ }
    ]
  },
  output: {
    filename: 'dist/ReactCart.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};
