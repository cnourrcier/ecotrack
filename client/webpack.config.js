const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = () => {
    // call dotenv and it will return an Object with a parsed key 
    const env = dotenv.config().parsed;

    // reduce it to a nice object, the same as before
    const envKeys = Object.keys(env).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(env[next]);
        return prev;
    }, {});

    return {
        entry: './src/index.jsx',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].[contenthash].js', // Generate unique names for each chunk
            publicPath: '/',
            clean: true, // Clean the dist folder before each build
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: ['babel-loader'],
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.(png|jpg|jpeg|gif|svg)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'images/[name][ext]'
                    }
                },
            ],
        },
        resolve: {
            extensions: ['*', '.js', '.jsx'],
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './public/index.html',
            }),
            new webpack.DefinePlugin(envKeys),
            new BundleAnalyzerPlugin({
                analyzerMode: 'static', // Generates an HTML file with bundle analysis
                openAnalyzer: false,    // Prevents the analyzer from automatically opening
                reportFilename: 'bundle-report.html' // Name of the report file
            }),
        ],
        optimization: {
            minimize: true,
            minimizer: [new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true,
                    },
                },
            })],
            splitChunks: {
                chunks: 'all', // Apply optimization to all chunks (async and initial)
                minSize: 20000,
                maxSize: 244000,
                cacheGroups: {
                    defaultVendors: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                        priority: -10,
                    },
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true,
                    },
                },
            },
        },
        devServer: {
            static: {
                directory: path.join(__dirname, 'public'),
            },
            historyApiFallback: true,
            port: 3000,
            hot: true,
            proxy: [
                {
                    context: ['/api'],
                    target: 'http://localhost:5000',
                    changeOrigin: true,
                },
            ],
        },
    };
};