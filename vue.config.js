// https://github.com/andreashuber69/net-worth#--
const schema = require("./src/model/validation/schemas/All.schema.json");

const AsyncCssPlugin = require("async-css-plugin");
const OfflinePlugin = require("offline-plugin");
const PreloadPlugin = require("@vue/preload-webpack-plugin");

module.exports = {
    // publicPath needs to be set differently depending on whether we build for actual deployment (e.g. on github
    // gh-pages) or for local production mode testing. The following uses an exported environment variable to do just
    // that. Obviously, this needs to bet set accordingly before building for deployment. 
    publicPath: process.env.WEBPACK_BASE_URL ? process.env.WEBPACK_BASE_URL : "/",
    transpileDependencies: ["vuetify"],
    configureWebpack: config => {
        if (process.env.NODE_ENV === "production") {
            const schemaNames = Object.keys(schema.definitions);

            // The following tweaks are necessary because bitcoinjs-lib requires that certain class names are not
            // mangled, see https://github.com/bitcoinjs/bitcoinjs-lib/issues/659. bitcoinjs-lib is no longer used
            // directly but apparently it is used indirectly by FastXpub.
            // Moreover, Validator also depends on schema class names not being mangled.
            config.optimization.minimizer[0].options.terserOptions.mangle.reserved = [
                "Array", "BigInteger", "Boolean", "Buffer", "ECPair", "Function", "Number", "Point", ...schemaNames
            ];
        }
    },
    chainWebpack: config => {
        config.plugin("async-css-plugin").use(AsyncCssPlugin, [{ logLevel: "info" }]);
        config.plugin("offline-plugin").use(OfflinePlugin);

        // The code below leads to font and background downloads being started before script and css downloads and
        // the plugin doesn't seem to offer a way to change that order. This is unfortunate because the downloads
        // started later have a higher probability of being stalled (e.g. due to the web server limiting simultaneous
        // downloads). Because script processing usually requires a fair amount of CPU, it would be better to at least
        // start .js downloads first.
        // Note that the plugin can also prefetch (as opposed to preload) assets, which would lead to font and
        // background downloads being initiated later, but the plugin then fails to set the proper as attribute, which
        // in turn leads to the assets being downloaded twice.
        config.plugin("preload").use(PreloadPlugin, [
            {
                rel: "preload",
                include: "allAssets",
                // cSpell: ignore woff
                as(entry) {
                    if (/\.woff2$/.test(entry)) {
                        return "font";
                    } else if (/\.png$/.test(entry)) {
                        return "image";
                    } else {
                        return "";
                    }
                },
                // cSpell: ignore prefetch
                // We preload what's necessary to display the main page but isn't already linked in index.html. After
                // the very first load of the app, the OfflinePlugin will fetch all remaining assets, which is why all
                // later requests (like e.g. the ones triggered by the About dialog) will be answered by the service
                // worker and never hit the network.
                fileWhitelist: [/background/, /\.woff2$/],
            }
        ]);
    }
}
