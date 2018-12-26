import React from 'react'
import { path, compose, multiply, prop, map, pluck, sort, head } from 'ramda'
import * as d3 from 'd3'
import { min, half, indexMap } from '../utils'

const circumference = (height, n, x) => (height / n) * (n - x)

const radius = compose(
  half,
  circumference
)

const getPosition = (x, y) =>
  path([x, y])({
    0: {
      0: 3,
      1: 2,
      2: 1,
    },
    1: {
      0: 1,
      1: 3,
      2: 2,
    },
    2: {
      0: 2,
      1: 1,
      2: 3,
    },
  })

const unit = compose(
  min,
  pluck('r')
)

const data = (width, height, timelines) =>
  indexMap(
    (x, i) => ({
      timeline: x,
      id: i,
      x: half(width),
      y: half(height),
      r: radius(Math.min(width - 30, height - 30), timelines.length, i),
      width: multiply(4, getPosition(0, i)),
    }),
    timelines
  )

const newData = data => id =>
  map(
    x => ({
      ...x,
      r: multiply(unit(data), getPosition(id, x.id)),
      width: multiply(4, getPosition(id, x.id)),
    }),
    data
  )

const primaryTimeline = compose(
  prop('timeline'),
  head,
  sort((a, b) => a.r - b.r)
)
const updater = svg => data =>
  svg
    .selectAll('circle')
    .data(data)
    .transition(
      d3
        .transition()
        .duration(750)
        .on('end', () => setUpNotches(svg, primaryTimeline(data)))
    )
    .attr('r', prop('r'))
    .attr('stroke-width', prop('width'))

const handleClick = (svg, data) =>
  compose(
    updater(svg),
    newData(data),
    prop('id')
  )

const setUpCircles = (svg, data) =>
  svg
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('cx', prop('x'))
    .attr('cy', prop('y'))
    .attr('r', prop('r'))
    .attr('stroke-width', prop('width'))
    .on('click', x => {
      handleClick(svg, data)(x)
      removeNotches(svg)
    })

const getAngle = (i, numNodes) => (i / (numNodes / 2)) * Math.PI

const getX = radius => angle => radius * Math.cos(angle) + radius

const getY = radius => angle => radius * Math.sin(angle) + radius

const transpose = (totalWidth, radius) => x => x + totalWidth / 2 - radius

const notch = (numNodes, radius, totalWidth = 1000) => (x, i) => ({
  ...x,
  id: i + 'Notch',
  x: compose(
    transpose(totalWidth, radius),
    getX(radius),
    getAngle
  )(i, numNodes),
  y: compose(
    transpose(totalWidth, radius),
    getY(radius),
    getAngle
  )(i, numNodes),
})

const notches = (radius, timeline) =>
  indexMap(notch(timeline.length, radius), timeline)

const getBoxX = (x, boxWidth, totalWidth = 1000) =>
  x < totalWidth / 2 ? x + 15 : x - 15 - boxWidth

const htmlToText = html => {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return doc.body.textContent || ''
}

const addInfoBox = svg => ({ x, y, html, boxWidth = 150 }) => {
  svg
    .append('rect')
    .attr('x', getBoxX(x, boxWidth))
    .attr('y', getBoxX(y, boxWidth))
    .attr('width', boxWidth)
    .attr('height', boxWidth)
    .attr('fill', 'white')
    .attr('stroke', 'black')
  svg
    .append('text')
    .attr('x', getBoxX(x, boxWidth) + 3)
    .attr('y', getBoxX(y, boxWidth) + 15)
    .text(htmlToText(html))
}

const removeInfoBox = svg => () => {
  svg.selectAll('rect').remove()
  svg.selectAll('text').remove()
}

const setUpNotches = (svg, timeline) => {
  svg
    .selectAll('circle.notch')
    .data(notches(495, timeline))
    .enter()
    .append('svg:circle')
    .attr('class', 'notch')
    .attr('r', 5)
    .attr('cx', prop('x'))
    .attr('cy', prop('y'))
    .attr('id', prop('id'))
    .on('mouseover', addInfoBox(svg))
    .on('mouseleave', removeInfoBox(svg))
    .on('click', addInfoBox(svg))
}

const removeNotches = svg => svg.selectAll('circle.notch').remove()

export default class GoodCircles extends React.Component {
  constructor() {
    super()
    this.height = 1000
    this.width = 1000
    this.circleCount = 3
  }
  componentDidMount() {
    const initialState = data(this.width, this.height, this.props.timelines)
    const svg = d3.select('svg')
    setUpCircles(svg, initialState)
    setUpNotches(svg, this.props.timelines[0])
  }
  render() {
    return <svg height={this.height} width={this.width} />
  }
}
