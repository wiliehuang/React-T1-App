module.exports = {
  entry: "./app/app.jsx",
  output: {
    path: __dirname + "/public",
    filename: "bundle.js"
  },
  module: {
    loaders: [
      { test: /\.jsx?$/,
        include: /app/, loader: 'babel-loader',
        query: { presets: ['react', 'es2015'] }
      }

    ]
  }
};
