const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = ({nodehost = "https://iona.thaumagen.io"}) => ({
  devServer: {
    proxy: {
      "/node": {
        "changeOrigin": true,
        "cookieDomainRewrite": "localhost",
        "target": nodehost,
        secure: false,
        onProxyReq : proxyReq => {
          // console.log(proxyReq);
          if (proxyReq.getHeader('origin')) {
            proxyReq.setHeader('origin', nodehost);
          }
        }
      }
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
     // Copy empty ServiceWorker so install doesn't blow up
     new CopyWebpackPlugin({patterns:[{from:'src/sw.js'}]}, {
      ignore: ['.DS_Store']
    })
  ],
  devtool: 'source-map'
});
