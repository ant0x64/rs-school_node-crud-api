module.exports = {
  entry: './dist/src/app.js',
  output: {
    filename: 'app.min.js',
    path: __dirname + '/dist',
  },
  target: "node",
  module: {
    rules: [
      {
        test: /^node\:/,
        loader: "node-loader",
      },
    ],
  },
};
