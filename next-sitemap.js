/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: process.env.SITE_URL || 'https://culinary-canvas.com',
  generateRobotsTxt: true, // (optional)
  exclude: ['/admin', '/admin/*', '/404'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: ['/admin', '/admin/*', '/assets/*'],
      },
    ],
  },
  // ...other options
}
