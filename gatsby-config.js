module.exports = {
  siteMetadata: {
    title: 'Circles',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-netlify-cms',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages/media`,
        name: 'media',
      },
    },
    'gatsby-transformer-remark',
  ],
}
