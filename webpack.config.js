const path = require('path');

module.exports = {
    entry: './src/frontend/ts/index.ts',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'build/frontend/js'),
    },
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js'],
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: "ts-loader" },
        ],
    },
}
