const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");



module.exports = {
    mode: "production",
    entry: { main: './src/index.js' },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].[chunkhash].js",
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            include: [
                path.resolve(__dirname, "src")
            ],
            exclude: [
                path.resolve(__dirname, "node_modules")
            ],
            use: {
                loader: "babel-loader"
            }
        }, {
            test: /\.scss?$/,
            include: [
                path.resolve(__dirname, "src")
            ],
            exclude: [
                path.resolve(__dirname, "node_modules")
            ],
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: ['css-loader', 'sass-loader']
            })
        }, {
            test: /\.(fbx)$/i,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'assets/',
                    publicPath: 'dist/models'
                }
            }],
        }, {
            test: /\.(glsl)$/i,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'shaders/',
                    publicPath: 'dist/shaders'
                }
            }],
        }, {
            test: /\.(mp3)$/i,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'audio/',
                    publicPath: 'dist/audio'
                }
            }],
        }, {
            test: /\.(jpg|png)$/i,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'images/',
                    publicPath: 'dist/images'
                }
            }],
        }, {
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'fonts/'
                }
            }]
        }]
    },
    plugins: [
        new CleanWebpackPlugin('dist', {}),
        new ExtractTextPlugin({ filename: 'style.[chunkhash].css' }),
        new HtmlWebpackPlugin({
            inject: false,
            hash: true,
            template: './src/index.html',
            filename: 'index.html',
        }),
        // new CopyPlugin({
        //   patterns: [
        //     { from: "src/warrior/SwordAndShield", to: "models/SwordAndShield" },
        //     { from: "src/trees/models", to: "models/Threes" },
        //     { from: "src/cubeplane/model", to: "models/CubePlane" },
        //     { from: "src/peasant/model", to: "models/Peasant" },
        //     // { from: "other", to: "public" },
        //   ],
        // }),
    ]
};