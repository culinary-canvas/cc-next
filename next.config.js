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
      // device sizes correspond (roughly) to 0.25 and 0.5 x BREAKPOINT
      deviceSizes: [172, 248, 344, 496, 688, 992, 1024, 1312, 2048, 4096],
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
