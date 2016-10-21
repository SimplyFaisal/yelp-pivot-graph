const React = require('react');
import * as d3 from "d3";
const rollup = require('./rollup.js');

const Store = require('./state').Store;

class GraphRoller {

  super(G) {
    this.G_ = G;
    this.x_ = null;
    this.y_ = null;
    this.fx_ = null;
    this.fy_ = null;
    this.directed_ = false;
  }

  execute = () => {
    var linkMap = {};
    this.G_.nodes.forEach((x, i) => {
      linkMap[x.id] = i;
    });
    var getNode = x => linkMap[x.id];
    return rollup(G_)
      .links(g => g.edges)
      .directed(false)
      .linkSource(getNode)
      .linkTarget(getNode)
      .x(d => this.x_(this.fx_(d)))
      .y(d => this.y_(this.fy_(d)));

  }

  x = (x) => {
    this.x_ = x
    return this;
  }

  y = (y) => {
    this.y_ = y;
    return this;
  }

  fx = (fx) => {
    this.fx_ = fx;
    return this;
  }

  fy = (fy) => {
    this.fy_ = fy;
    return this;
  }
}

class PivotGraph extends React.Component {

  constructor(props) {
    super(props);
    this.svg = null;
    this.height = 300;
    this.width = 400;
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
      var yScale = null;
      var xScale = null;
      var fx = null;
      var fy = null;
      var rolled = new GraphRoller(G)
        .x(xScale)
        .y(yScale)
        .fx(fx)
        .fy(fy)
        .execute();
      this.drawPivotGraph(rolled);
    });
  }

  drawPivotGraph = (G) => {
    console.log(rolled);
  }
}

module.exports = PivotGraph;
