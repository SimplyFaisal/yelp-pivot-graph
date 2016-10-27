const React = require('react');
import * as d3 from "d3";
const Rollup = require('./rollup.js');
const constants = require('./constants.js');

const DataType = constants.DataType;
const Store = require('./state').Store;

class PivotGraph extends React.Component {

  constructor(props) {
    super(props);
    this.svg = null;
    this.margin = {top: 50, right: 50, bottom: 50, left: 50};
    this.width = 700 - this.margin.left - this.margin.right,
    this.height = 700 - this.margin.top - this.margin.bottom;
  }
  render = () => {
    return (
      <div>
        <svg id="pivot-graph" height={this.height} width={this.width}></svg>
      </div>
    )
  }

  componentDidMount = () => {
    Store.subscribe(() => {
      var state = Store.getState();
      var G = state['GRAPH'];
      if (!G) {
        return;
      }
      var xAttribute = state['XAXIS_ATTRIBUTE'];
      var yAttribute = state['YAXIS_ATTRIBUTE'];
      if (!xAttribute || !yAttribute) {
        return;
      }

      var fx = xAttribute.f;
      var fy = yAttribute.f;

      var filteredNodes = G.nodes.filter(x => fx(x) != undefined && fy(x) != undefined);
      var filteredNodeIds = d3.set(filteredNodeIds, x => x.v);
      G.nodes = G.nodes.filter(x => !filteredNodeIds.has(x.v));
      G.edges = G.edges.filter(e => !filteredNodeIds.has(e.w) || !filteredNodeIds.has(e.v));

      var xScale = xAttribute.scale()
        .domain(xAttribute.domain(G.nodes))
        .range([this.margin.left, this.width])

      var yScale = yAttribute.scale()
        .domain(yAttribute.domain(G.nodes))
        .range([this.margin.top, this.height - this.margin.top]);

      var xAxis = d3.axisBottom()
        .scale(xScale)

      var yAxis = d3.axisLeft()
        .scale(yScale)

      var map = d3.map(d3.range(G.nodes.length), i => G.nodes[i].v);
      G.nodes.forEach((x) => {
        x.index = map.get(x.v);
      });

      var rollup = Rollup.rollup()
        .links(g => g.edges)
        .directed(false)
        .linkSource(e => map.get(e.w))
        .linkTarget(e => map.get(e.v))
        .x(d => xScale(fx(d)))
        .y(d => yScale(fy(d)));

      G = rollup(G);

      var radiusScale = d3.scaleLinear()
          .domain(d3.extent(G.nodes, x => x.nodes.length))
          .range([5, 20]);

      var edgeWeightScale = d3.scaleLinear()
          .domain(d3.extent(G.links, x => x.value))
          .range([1, 10]);

      var svg = d3.select('#pivot-graph')
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

      svg.selectAll(".link")
        .data(G.links)
      .enter().append("path")
        .attr("class", "link")
        .attr("d", function(d) {
          var sx = d.source.x, sy = d.source.y,
              tx = d.target.x, ty = d.target.y,
              dx = tx - sx, dy = ty - sy,
              dr = 2 * Math.sqrt(dx * dx + dy * dy);
          return "M" + sx + "," + sy + "A" + dr + "," + dr + " 0 0,1 " + tx + "," + ty;
        })
        .style("stroke-width", d => edgeWeightScale(d.value));

      svg.selectAll(".node")
          .data(G.nodes)
        .enter().append("circle")
          .attr("class", "node")
          .attr("r", (d) => radiusScale(d.nodes.length))
          .attr("cx", (d) => d.x)
          .attr("cy", (d) => d.y);

      svg.append("g")
          .attr("class", "x axis")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);
    });
  }

  drawPivotGraph = (G) => {

  }
}

module.exports = PivotGraph;
