const React = require('react');
const Select = require('react-select');
const enumify = require('enumify');
const redux = require('redux');
const axios = require('axios');

class AttributeType extends enumify.Enum {}
class ActionType extends enumify.Enum {}

ActionType.initEnum({
  SET_YAXIS_ATTRIBUTE: {},
  SET_XAXIS_ATTRIBUTE: {},
  SET_LOCATIONS: {}
});

function reducer(state, action) {
  switch(action.type) {
    case ActionType.SET_XAXIS_ATTRIBUTE:
      return Object.assign({}, state, {YAXIS_ATTRIBUTE: action.attribute});
      break;
    case ActionType.SET_YAXIS_ATTRIBUTE:
      return Object.assign({}, state, {XAXIS_ATTRIBUTE: action.attribute});
      break;
    case ActionType.SET_LOCATIONS:
      return Object.assign({}, state, {LOCATIONS: action.locations});
      break;
      case ActionType.SET_GRAPH:
        return Object.assign({}, state, {GRAPH: action.graph});
        break;
    default:
      break
  }
}

var initialState = {};
var store = redux.createStore(reducer, {});

AttributeType.initEnum({
  STARS: {label: 'Stars', value: 'STARS'},
  CATEGORIES: {label: 'Categories', value: 'CATEGORIES'},
  REVIEW_COUNT: {label: 'Review Count', value: 'REVIEW_COUNT'},
  ATTIRE: {label: 'Attire', value: 'ATTIRE'},
  PRICE_RANGE: {label: 'Price Range', value: 'PRICE_RANGE'},
  DELIVERY: {label: 'Delivery', value: 'DELIVERY'}
});


class Panel extends React.Component {
  state = {
    xAttribute: null,
    yAttribute: null,
    isLoadingLocations: true,
    locations: []
  }

  constructor(props) {
    super(props)
    this.onXChange = this.onXChange.bind(this);
    this.onYChange = this.onYChange.bind(this);
    this.onLocationChange = this.onLocationChange.bind(this);
    this.getLocations = this.getLocations.bind(this);
    this.onGraphButtonClick = this.onGraphButtonClick.bind(this);
  }

  render () {
    return (
      <div className="panel panel-default">
        <div className="panel-body">
          <Select.Async
            name="locations"
            multi={true}
            value={this.state.locations}
            isLoading={this.state.isLoadingLocations}
            loadOptions={this.getLocations}
            onChange={this.onLocationChange}
          />
          <Select
            name="x-axis"
            value={this.state.xAttribute}
            options={AttributeType.enumValues}
            onChange={this.onXChange}
          />
          <Select
              name="y-axis"
              value={this.state.yAttribute}
              options={AttributeType.enumValues}
              onChange={this.onYChange}
          />

          <a
            className="btn btn-default btn-lg btn-block"
            onClick={this.onGraphButtonClick}>
            Graph!
          </a>
        </div>
      </div>
    )
  }

  onXChange(value) {
    this.setState({xAttribute: value});
    store.dispatch({type: ActionType.SET_XAXIS_ATTRIBUTE, attribute: value});
  }

  onYChange(value) {
    this.setState({yAttribute: value});
    store.dispatch({type: ActionType.SET_YAXIS_ATTRIBUTE, attribute: value})
  }

  onLocationChange(values) {
    this.setState({locations: values});
    store.dispatch({type: ActionType.SET_LOCATIONS, locations: values})
  }

  onGraphButtonClick(event) {
    event.preventDefault();
    var state = store.getState();
    var locations = state['LOCATIONS'].map(x => x.value).join(',');
    axios.get('/api/graph', {params: {locations: locations}})
        .then((response) => {
      store.dispatch({type: ActionType.SET_GRAPH, graph: response.data});
    })
    .catch((error) => {
      console.error(error);
    });
  }

  getLocations(input) {
    return axios.get('/api/locations').then((response) => {
      var locations = response.data.map((location) => {
        return {label: location, value: location};
      });
      this.setState({isLoadingLocations: false});
      return {options: locations};
    })
    .catch((error) => {
      console.error(error);
    });
  }
};

module.exports = Panel;
