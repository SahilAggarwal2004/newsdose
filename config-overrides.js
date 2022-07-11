const { InjectManifest } = require('workbox-webpack-plugin')

module.exports = function override(config) {
    // New config, e.g. config.plugins.push...
    config.plugins.push(new InjectManifest({ swSrc: '/src/sw.js', swDest: 'sw.js' }))
    return config
}