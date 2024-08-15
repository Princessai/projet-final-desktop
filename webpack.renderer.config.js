const rules = require('./webpack.rules');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

rules.push({
  test: /\.(png|jpg|gif|svg)$/,  // File extensions for images
  type: 'asset/resource',        // Built-in Webpack feature to handle assets
  generator: {
    filename: 'assets/', // Output to 'images' directory
  },
});

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
};
