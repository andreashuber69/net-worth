// cSpell: disable
const karmaTypescriptConfig = {
    bundlerOptions: {
        entrypoints: /\.spec\.ts$/,
        sourceMap: true
    },
    compilerDelay: 3000,
    compilerOptions: {
        module: "commonjs"
    },
    coverageOptions: {
        // Set this to false while debugging
        instrumentation: true
    },
    include: {
        mode: "replace",
        values: [
            "src/model/**/*.ts"
        ]
    },
    reports: {
        lcovonly: {
            directory: "coverage",
            subdirectory: ".",
            filename: "lcov.lcov"
        },
        html: {
            directory: "coverage",
            subdirectory: "."
        }
    },
    tsconfig: "./tsconfig.json"
};

module.exports = function(config) {
    config.set({
        frameworks: ["jasmine", "karma-typescript"],
        files: [
            { 
                pattern: "src/model/**/*.ts",
            },
            { 
                pattern: "src/model/ModelParser.spec/*.assets",
                included: false,
                served: true
            }
        ],
        preprocessors: {
            "**/*.ts": ["karma-typescript"]
        },
        reporters: ["dots", "karma-typescript"],
        browsers: ["Chrome", "ChromeHeadless"],
        // Set this to false while debugging
        singleRun: true,
        karmaTypescriptConfig: karmaTypescriptConfig
    });
};
