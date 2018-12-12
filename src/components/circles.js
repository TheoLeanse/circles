import React from 'react'
import * as d3 from 'd3'
const divide = x => y => x / y
const half = divide(2)
const arrayOfN = x => [...Array(x)].map((x, i) => i)
const getRadii = (height, n) => [1, 2, 3].map(x => (height / n) * (n - x))

export default class GoodCircles extends React.Component {
  componentDidMount() {
    const { innerWidth: width, innerHeight: height } = window
    this.updateD3({ width, height })
  }
  updateD3({ width, height }) {
    const svg = d3
      .select('.beep')
      .append('svg')
      .attr('width', width)
      .attr('height', height)

    const radii = getRadii(height, 3)

    const data = radii.map((x, i) => ({
      x: half(width),
      y: half(height),
      r: x,
      id: i,
    }))

    const a = {
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
    }

    const unit = Math.min(...radii)

    const handleClick = x => {
      const newData = data.map(y => ({
        ...y,
        r: a[x.id][y.id] * unit,
      }))

      svg
        .selectAll('circle')
        .data(newData)
        .transition(d3.transition().duration(750))
        .attr('r', d => d.r)
    }

    svg
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.r)
      .attr('stroke-width', 10)
      .on('click', handleClick)
  }

  render() {
    return <div className="beep" />
  }
}
