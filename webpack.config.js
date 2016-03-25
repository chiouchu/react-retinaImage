var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var webpackConfig = {
    entry: "./js/entry.js",
    output: {
        filename: "build/bundle.js"
    },
    module: {
        preLoaders: [
            {
                test: /\.js?$/,
                loader: 'eslint-loader',
                include: path.resolve(__dirname, 'js/'),
                exclude: /node_modules/
            }
        ],
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: path.resolve(__dirname, 'js/'),
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"development"'
            }
        })
    ]
};

module.exports = webpackConfig;
