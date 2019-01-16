const OfflinePlugin = require("offline-plugin");

module.exports = {
    // publicPath needs to be set differently depending on whether we build for actual deployment (e.g. on github
    // gh-pages) or for local production mode testing. The folling uses an exported environment variable to do just
    // that. Obviously, this needs to bet set accordingly before building for deployment. 
    publicPath: process.env.WEBPACK_BASE_URL ? process.env.WEBPACK_BASE_URL : "/",
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            // The following tweaks are necessary because bitcoinjs-lib requires that certain class names are not mangled,
            // see https://github.com/bitcoinjs/bitcoinjs-lib/issues/659.
            config.optimization.minimizer[0].options.terserOptions.mangle.reserved = [
                'Array', 'BigInteger', 'Boolean', 'Buffer', 'ECPair', 'Function', 'Number', 'Point'
            ];
        }
    },
    chainWebpack: config => {
        config.plugin("offline-plugin").use(OfflinePlugin);
    }
}
