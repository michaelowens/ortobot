module.exports = {
  configureWebpack: (config) => {
    if (process.env.NODE_ENV !== 'production') {
      config.devServer = {
        before: require('./server/configure'),
      }
    }
  },
}
