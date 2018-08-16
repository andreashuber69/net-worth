const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OfflinePlugin = require("offline-plugin");

module.exports = {
    // baseUrl needs to be set differently depending on whether we build for actual deployment (e.g. on github gh-pages)
    // or for local production mode testing. The folling uses an exported environment variable to do just that.
    // Obviously, this needs to bet set accordingly before building for deployment. 
    baseUrl: process.env.WEBPACK_BASE_URL ? process.env.WEBPACK_BASE_URL : "/",
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            config.optimization.minimizer = [
                new UglifyJsPlugin({
                    test: /\.js(\?.*)?$/i,
                    warningsFilter: function () {
                        return true;
                    },
                    extractComments: false,
                    sourceMap: true,
                    cache: true,
                    parallel: true,
                    include: undefined,
                    exclude: undefined,
                    uglifyOptions: {
                        output: {
                            comments: /^\**!|@preserve|@license|@cc_on/
                        },
                        compress: {
                            arrows: false,
                            collapse_vars: false,
                            comparisons: false,
                            computed_props: false,
                            hoist_funs: false,
                            hoist_props: false,
                            hoist_vars: false,
                            inline: false,
                            loops: false,
                            negate_iife: false,
                            properties: false,
                            reduce_funcs: false,
                            reduce_vars: false,
                            switches: false,
                            toplevel: false,
                            typeofs: false,
                            booleans: true,
                            if_return: true,
                            sequences: true,
                            unused: true,
                            conditionals: true,
                            dead_code: true,
                            evaluate: true
                        },
                        mangle: {
                            safari10: true,
                            // The following tweaks are necessary because bitcoinjs-lib requires that certain class names are not mangled,
                            // see https://github.com/bitcoinjs/bitcoinjs-lib/issues/659. Only this reserved property needs to be added
                            // to the default. Apparently we need to duplicate the defaults for the remaining settings, see
                            // https://stackoverflow.com/questions/49053215/webpack-4-how-to-configure-minimize
                            reserved: [
                                'Array', 'BigInteger', 'Boolean', 'Buffer', 'ECPair', 'Function', 'Number', 'Point'
                            ]
                        }
                    }
                })                
            ];
        }
    },
    chainWebpack: config => {
        config.plugin("offline-plugin").use(OfflinePlugin);
    }
}
