const React = require('react');
import * as d3 from "d3";
const Rollup = require('./rollup.js');

const Store = require('./state').Store;

class PivotGraph extends React.Component {

  constructor(props) {
    super(props);
    this.svg = null;
    this.margin = {top: 50, right: 50, bottom: 50, left: 50};
    this.width = 700 - this.margin.left - this.margin.right,
    this.height = 500 - this.margin.top - this.margin.bottom;
  }
  render = () => {
    return (
      <div> Pivot Graph
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
      var xScale = xAttribute.scale()
        .domain(d3.extent(G.nodes, fx))
        .range([this.margin.left, this.width]);

      var fy = yAttribute.f;
      var yScale = yAttribute.scale()
        .domain(d3.extent(G.nodes, fy))
        .range([this.margin.top, this.height - this.margin.top]);

      var xAxis = d3.axisBottom()
        .scale(xScale)

      var yAxis = d3.axisLeft()
        .scale(yScale)

      var linkMap = {};
      G.nodes.forEach((x, i) => {
        linkMap[x.id] = i;
      });
      var getNode = x => linkMap[x.id];
      var rollup = Rollup.rollup()
        .links(g => g.edges)
        .directed(false)
        .linkSource(getNode)
        .linkTarget(getNode)
        .x(d => xScale(fx(d)))
        .y(d => yScale(fy(d)));

      G = rollup(G);

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
        .style("stroke-width", function(d) { return 10; });

      svg.selectAll(".node")
          .data(G.nodes)
        .enter().append("circle")
          .attr("class", "node")
          .attr("r", function(d) { return Math.sqrt(d.nodes.length * 40); })
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });

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
