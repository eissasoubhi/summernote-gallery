
const path = require( 'path' );

// common Configuration
const config = {

    // bundling mode
    mode: 'production',

    // file resolutions
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
        alias: {
            '@': path.resolve(__dirname, 'src/'),
            Bricks: path.resolve(__dirname, 'src/Bricks/'),
            Utils: path.resolve(__dirname, 'src/Utils/')
        }
    },

    // loaders
    module: {
        rules: [
            {
                test: /\.tsx?/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        allowTsInNodeModules: true
                    }
                },
                exclude: /node_modules(?!\/snb-components)/,
            }
        ]
    },

    devtool: 'source-map'
};

const brickConfig = { ...config, ...{
    name: "galleryBrick",
    entry: "./src/index.ts",
    output: {
        path: path.resolve( __dirname, 'dist' ),
        filename: 'snb-gallery-brick.min.js',
    },
}};

const moduleConfig = { ...config, ...{
    name: "galleryModule",
    entry: "./src/Module/index.ts",
    output: {
        library: {
          name: 'module',
          type: 'umd',
        },
        path: path.resolve( __dirname, 'dist' ),
        filename: 'module/index.js',
    },
}};

// Return Array of Configurations
module.exports = [
    brickConfig, moduleConfig,
];