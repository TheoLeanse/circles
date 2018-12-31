import React from 'react'
import { path, compose, prop } from 'ramda'
import { BOX_WIDTH, BOX_HEIGHT } from './circles'

const parseHtml = html => new DOMParser().parseFromString(html, 'text/html')

const stripHtml = compose(
  path(['body', 'textContent']),
  parseHtml
)

const clean = x => {
  try {
    const { pathname } = new URL(x)
    return pathname
  } catch (e) {
    return '/' + x
  }
}

const Embed = ({ code }) => {
  const srcURL = `https://player.vimeo.com/video${clean(code)}`
  return (
    <iframe
      src={srcURL}
      width={BOX_WIDTH}
      height={BOX_HEIGHT - 50}
      frameBorder="0"
      allowFullScreen
    />
  )
}

const Media = ({ image, embed }) => {
  if (image) return <img src={image} />
  if (embed) return <Embed code={embed} />
  return null
}

const Content = ({ content }) =>
  stripHtml(content) ? <span>{stripHtml(content)}</span> : null

const Tooltip = ({ html, frontmatter }) => (
  <div className={'beep'}>
    <Content content={html} />
    <Media {...frontmatter} />
    <button className={'js-close-tooltip'}>Close</button>
  </div>
)

export default Tooltip
