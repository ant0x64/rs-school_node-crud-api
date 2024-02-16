module.exports = {
  entry: './dist/src/server.js',
  output: {
    filename: 'server.min.js',
    path: __dirname + '/dist',
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /^node\:/,
        loader: 'node-loader',
      },
    ],
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
