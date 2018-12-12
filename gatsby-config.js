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
  ],
}
