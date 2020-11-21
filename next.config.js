const withImages = require('next-images')

module.exports = withImages({
  sassOptions: {
    includePaths: ['src/styles'],
  },
})

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
