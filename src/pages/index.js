import React from 'react'
import GoodCircles from '../components/circles'
import { groupBy, pluck, path, compose } from 'ramda'

const timelines = compose(
  Object.values,
  groupBy(path(['frontmatter', 'timeline'])),
  pluck('node'),
  path(['allMarkdownRemark', 'edges'])
)

const IndexPage = ({ data }) => <GoodCircles timelines={timelines(data)} />

export default IndexPage
export const query = graphql`
  query MyQueryName {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark {
      edges {
        node {
          html
          frontmatter {
            title
            timeline
            embed
          }
        }
      }
    }
  }
`
