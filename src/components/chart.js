import React, { Component } from 'react'
import * as d3 from 'd3'

const random = d3.randomNormal(5, 1)

export default class Chart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data1: d3.range(20).map(_ => [random(), random()]),
      data2: d3.range(20).map(_ => [random(), random()]),
      zoomTransform: null,
    }
    this.zoom = d3
      .zoom()
      //   .scaleExtent([-5, 5])
      .translateExtent([[-100, -100], [props.width + 100, props.height + 100]])
      .extent([[-100, -100], [props.width + 100, props.height + 100]])
      .on('zoom', this.zoomed.bind(this))
  }
  componentDidMount() {
    d3.select(this.refs.svg).call(this.zoom)
  }
  componentDidUpdate() {
    d3.select(this.refs.svg).call(this.zoom)
  }
  zoomed() {
    this.setState({
      zoomTransform: d3.event.transform,
    })
  }
  render() {
    const { zoomTransform } = this.state,
      { width, height } = this.props

    return (
      <svg width={width} height={height} ref="svg">
        <Scatterplot
          data={this.state.data1}
          x={-10}
          y={-10}
          width={width / 2}
          height={height / 2}
          zoomTransform={zoomTransform}
          zoomType="scale"
        />
        <Scatterplot
          data={this.state.data2}
          x={width / 2}
          y={-10}
          width={width / 2}
          height={height / 2}
          zoomTransform={zoomTransform}
          zoomType="detail"
        />
      </svg>
    )
  }
}

class Scatterplot extends React.Component {
  constructor(props) {
    super(props)
    this.updateD3(props)
  }
  componentWillUpdate(nextProps) {
    this.updateD3(nextProps)
  }
  updateD3(props) {
    const { data, width, height, zoomTransform, zoomType } = props

    this.xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, ([x, y]) => x)])
      .range([0, width])

    this.yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, ([x, y]) => y)])
      .range([0, height])

    if (zoomTransform && zoomType === 'detail') {
      this.xScale.domain(zoomTransform.rescaleX(this.xScale).domain())
      this.yScale.domain(zoomTransform.rescaleY(this.yScale).domain())
    }
  }
  get transform() {
    const { x, y, zoomTransform, zoomType } = this.props
    let transform = ''

    if (zoomTransform && zoomType === 'scale') {
      transform = `translate(${x + zoomTransform.x}, ${y +
        zoomTransform.y}) scale(${zoomTransform.k})`
    } else {
      transform = `translate(${x}, ${y})`
    }

    return transform
  }
  render() {
    const { data } = this.props

    return (
      <g transform={this.transform} ref="scatterplot">
        {data.map(([x, y]) => (
          <circle
            cx={this.xScale(x)}
            cy={this.yScale(y)}
            r={8}
            fill={'none'}
            stroke={'black'}
          />
        ))}
      </g>
    )
  }
}

class Circle extends Component {
  constructor(props) {
    super(props)
    this.updateD3(props)
  }
  componentWillUpdate(nextProps) {
    this.updateD3(nextProps)
  }
  updateD3() {
    const { data, width, height, zoomTransform, zoomType } = props

    this.xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, ([x, y]) => x)])
      .range([0, width])

    this.yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, ([x, y]) => y)])
      .range([0, height])
  }
}
