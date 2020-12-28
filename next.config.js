const withImages = require('next-images')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
module.exports = withBundleAnalyzer(
  withImages({
    sassOptions: {
      includePaths: ['src/styles'],
    },
    images: {
      domains: ['firebasestorage.googleapis.com'],
    },
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
