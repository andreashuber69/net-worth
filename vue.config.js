// Copyright (C) 2018-2019 Andreas Huber Dönni
//
// This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
// License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
// version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
// warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with this program. If not, see
// <http://www.gnu.org/licenses/>.

const schema = require("./src/model/validation/schemas/All.schema.json");

const OfflinePlugin = require("offline-plugin");
const PreloadPlugin = require("@vue/preload-webpack-plugin");

module.exports = {
    // publicPath needs to be set differently depending on whether we build for actual deployment (e.g. on github
    // gh-pages) or for local production mode testing. The following uses an exported environment variable to do just
    // that. Obviously, this needs to bet set accordingly before building for deployment. 
    publicPath: process.env.WEBPACK_BASE_URL ? process.env.WEBPACK_BASE_URL : "/",
    configureWebpack: config => {
        if (process.env.NODE_ENV === "production") {
            const schemaNames = Object.keys(schema.definitions);

            // The following tweaks are necessary because bitcoinjs-lib requires that certain class names are not mangled,
            // see https://github.com/bitcoinjs/bitcoinjs-lib/issues/659.
            // Moreover, Validator also depends on schema class names not being mangled.
            config.optimization.minimizer[0].options.terserOptions.mangle.reserved = [
                "Array", "BigInteger", "Boolean", "Buffer", "ECPair", "Function", "Number", "Point", ...schemaNames
            ];
        }
    },
    chainWebpack: config => {
        config.plugin("offline-plugin").use(OfflinePlugin);

        // cSpell: ignore prefetch
        config.plugin("prefetch").use(PreloadPlugin, [{
            rel: "prefetch",
            include: "allAssets",
            // Apparently there's some unexpected interaction between the two plugins such that the preload plugin
            // tries to prefetch a file that does not exist in the output. /\.map/ is the default, so we need to add
            // that too
            // cSpell: ignore serviceworker
            fileBlacklist: [/\.map/, /__offline_serviceworker/]
        }]);
    }
}
