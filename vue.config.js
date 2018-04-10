module.exports = {
    chainWebpack: config => {
        // The following tweaks are necessary because bitcoinjs-lib requires that certain class names are not mangled,
        // see https://github.com/bitcoinjs/bitcoinjs-lib/issues/659.
        if (config.plugins.store.has('uglify')) {
            config.plugin('uglify').tap(options => {
                options[0].uglifyOptions.mangle.reserved = [
                    'Array', 'BigInteger', 'Boolean', 'Buffer', 'ECPair', 'Function', 'Number', 'Point'
                ];

                return options;
            });
        }
    }
}
