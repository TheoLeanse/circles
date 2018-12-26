import React from 'react'
import { pathOr, compose } from 'ramda'

const domParser = html => new DOMParser().parseFromString(html, 'text/html')

const stripHtml = compose(
  pathOr('', ['body', 'textContent']),
  domParser
)
const Media = ({ image, embed }) => (image ? <img src={image} /> : embed)

const Tooltip = ({ html, frontmatter }) => (
  <div>
    <h1>{stripHtml(html)}</h1>
    <Media {...frontmatter} />
  </div>
)
export default Tooltip
