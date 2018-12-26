module.exports = {
  siteMetadata: {
    title: 'Circles',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-netlify-cms',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/path/to/markdown/files`,
        name: 'markdown-pages',
      },
    },
  ],
}
