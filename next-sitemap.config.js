/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.URL || 'https://ipcc.palauproject.com',
    generateRobotsTxt: true,
    exclude: ["/hidden-dashboard", "/hidden-dashboard/*"]
}