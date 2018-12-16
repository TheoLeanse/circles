import React from 'react'
import { path, compose, multiply, prop, map, pluck } from 'ramda'
import * as d3 from 'd3'
import { minusTwo, min, half, zeroIndexArrayOfLength, indexMap } from '../utils'

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

const data = (width, height, n) =>
  indexMap(
    (x, i) => ({
      id: i,
      x: half(width),
      y: half(height),
      r: radius(Math.min(width - 10, height - 10), n, x),
      width: multiply(4, getPosition(0, i)),
    }),
    zeroIndexArrayOfLength(n)
  )

const newData = data => id =>
  map(
    x => ({
      ...x,
      r: multiply(unit(data), getPosition(id, x.id)),
      width: getPosition(id, x.id) * 4,
    }),
    data
  )

const updater = svg => data =>
  svg
    .selectAll('circle')
    .data(data)
    .transition(
      d3
        .transition()
        .duration(750)
        .on('end', () => setUpNotches(svg))
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

const notch = (numNodes, radius, totalWidth = 1000) => i => ({
  id: i,
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

const notches = (numberOfNotches, radius) =>
  map(notch(numberOfNotches, radius), zeroIndexArrayOfLength(numberOfNotches))

const getBoxX = (x, boxWidth, totalWidth = 1000) =>
  x < totalWidth / 2 ? x + 15 : x - 15 - boxWidth

const addInfoBox = svg => ({ x, y, boxWidth = 150 }) => {
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
    .text('AK')
}
const removeInfoBox = svg => () => {
  svg.select('rect').remove()
  svg.select('text').remove()
}

const setUpNotches = svg => {
  svg
    .selectAll('circle')
    .data(notches(7, 505))
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
    const initialState = data(this.width, this.height, this.circleCount)
    const svg = d3.select('svg')
    setUpCircles(svg, initialState)
    setUpNotches(svg)
  }
  render() {
    return <svg height={this.height} width={this.width} />
  }
}
