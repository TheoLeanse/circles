import React from 'react'
import * as R from 'ramda'
import * as d3 from 'd3'
import { minusTwo, min, half, zeroIndexArrayOfLength, indexMap } from '../utils'

const height = 1000
const width = 1000

const circumference = (n, height) => x => (height / n) * (n - x)

const radius = (x, y) =>
  R.compose(
    minusTwo,
    half,
    circumference(x, y)
  )

const radii = (height, n) => R.map(radius(n, height), zeroIndexArrayOfLength(n))

const getPosition = (x, y) =>
  R.path([x, y])({
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

const unit = R.compose(
  min,
  R.map(R.prop('r'))
)

const data = indexMap(
  (x, i) => ({
    id: i,
    x: half(width),
    y: half(height),
    r: x,
    width: getPosition(0, i) * 4,
  }),
  radii(Math.min(width, height), 3)
)

const newData = data => id =>
  R.map(
    x => ({
      ...x,
      r: getPosition(id, x.id) * unit(data),
      width: getPosition(id, x.id) * 4,
    }),
    data
  )

const updater = data =>
  d3
    .select('svg')
    .selectAll('circle')
    .data(data)
    .transition(d3.transition().duration(750))
    .attr('r', d => d.r)
    .attr('stroke-width', ({ width }) => width)

const handleClick = data =>
  R.compose(
    updater,
    newData(data),
    R.prop('id')
  )

const setUpCircles = data =>
  d3
    .select('svg')
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', d => d.r)
    .attr('stroke-width', d => d.width)
    .on('click', handleClick(data))

export default class GoodCircles extends React.Component {
  componentDidMount() {
    setUpCircles(data)
  }
  render() {
    return <svg height={height} width={width} />
  }
}
