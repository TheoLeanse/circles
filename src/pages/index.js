import React from 'react'
import * as d3 from 'd3'
import GoodCircles from '../components/circles'

const IndexPage = () => <GoodCircles />

var dataset = [
  {
    color: 'orange',
    value: [100],
    text: 'ring_1',
    url: 'www.google.com',
  },
  {
    color: 'orange',
    value: [100],
    text: 'ring_2',
    url: 'www.google.com',
  },
  {
    color: 'orange',
    value: [100],
    text: 'ring_3',
    url: 'www.google.com',
  },
  {
    color: 'grey',
    value: [100],
    text: 'ring_4',
    url: 'www.google.com',
  },
  {
    color: 'grey',
    value: [100],
    text: 'ring_5',
    url: 'www.google.com',
  },
]

var width = 460,
  height = 300,
  cwidth = 25

// var color = d3.scale.category20()

const data = []
class noddyD3 extends React.Component {
  componentDidMount() {
    var pie = d3.layout.pie().sort(null)

    var arc = d3.svg.arc()
    var svg = d3
      .select('body')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

    var gs = svg
      .selectAll('g')
      .data(d3.values(dataset))
      .enter()
      .append('g')

    var path = gs
      .selectAll('path')
      .data(function(d) {
        return pie(d.value)
      })
      .enter()
      .append('path')
      .attr('fill', function(d, i, index) {
        return dataset[index].color
      })
      .attr('d', function(d, i, j) {
        return arc.innerRadius(1 + cwidth * j).outerRadius(cwidth * (j + 1))(d)
      })
      .on('mouseover', function(d) {
        var nodeSelection = d3.select(this).style({
          opacity: '0.8',
        })
      })
      .on('mouseout', function(d) {
        var nodeSelection = d3.select(this).style({
          opacity: '1.0',
        })
      })
      .on('click', function(d, i, index) {
        location.href = dataset[index].url
      })
  }
  render() {
    return <div className={'noddy'} />
  }
}

export default IndexPage
