var React = require('react');
var ReactDom = require('react-dom');
var redux = require('redux');

var Panel = require('./panel.jsx');
var PivotGraph = require('./pivot.jsx');


ReactDom.render(<Panel/>, document.getElementById('panel-container'));
ReactDom.render(<PivotGraph/>, document.getElementById('pivot-graph-container'));
