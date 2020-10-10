const withImages = require('next-images')
const withStyles = require('@webdeb/next-styles')

module.exports = withImages(
  withStyles({
    sass: true,
    modules: true,
    sassLoaderOptions: {
      sassOptions: {
        includePaths: ['src/styles'],
      },
    },
    miniCssExtractOptions: { ignoreOrder: true },
  }),
)

/*
 * Uncomment to get webpack config in startup log
 */
// module.exports = {
//     webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
//         console.log(config);
//         config.module.rules.map((rule) => console.log(JSON.stringify(rule)));
//         return config;
//     },
// };
