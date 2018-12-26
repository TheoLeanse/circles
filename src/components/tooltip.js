import React from 'react'
import { pathOr, compose } from 'ramda'

const domParser = html => new DOMParser().parseFromString(html, 'text/html')

const stripHtml = compose(
  pathOr('', ['body', 'textContent']),
  domParser
)

const clean = code => /\/?(.*)$/.exec(code)

const Embed = ({ code }) => (
  <iframe
    src={`https://player.vimeo.com/video/${clean(code)}`}
    width="640"
    height="400"
    frameBorder="0"
    allowfullscreen
  />
)

const Media = ({ image, embed }) => {
  if (image) return <img src={image} />
  if (embed) return <Embed code={embed} />
  return null
}

const Tooltip = ({ html, frontmatter }) => (
  <div className={'beep'}>
    <h1>{stripHtml(html)}</h1>
    <Media {...frontmatter} />
  </div>
)
export default Tooltip
