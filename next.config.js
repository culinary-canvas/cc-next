const withSass = require('@zeit/next-sass')
const withCss = require('@zeit/next-css')

module.exports = withSass(
  withCss({
    cssModules: true,
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
