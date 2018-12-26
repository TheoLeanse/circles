import React from 'react'
import GoodCircles from '../components/circles'

const IndexPage = ({ data }) => console.log(data) || <GoodCircles />

export default IndexPage
export const query = graphql`
  query MyQueryName {
    site {
      siteMetadata {
        title
      }
    }
  }
`
