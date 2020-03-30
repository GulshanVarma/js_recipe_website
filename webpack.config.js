const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// fetching the modulles in the variables

module.exports = {
    entry: ['babel-polyfill','./src/js/index.js'],
    output:{
        path : path.resolve(__dirname, 'dist'),
        filename : 'js/bundle.js'
    },
    devServer:{
        contentBase: './dist'
    },

    // always an array
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html'
        })
    ],

    module:{
        rules:[
            {
                test: /\.js$/,
                exclude: /node-modules/,
                use:{
                    loader: 'babel-loader'
                }
            }
        ]
    }
};