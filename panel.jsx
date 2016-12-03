const React = require('react');
const Select = require('react-select');
const Promise = require('bluebird');
const axios = require('axios');
const Spinner = require('react-spinkit');

const state = require('./state');
const constants = require('./constants');

const State = require('./state');
const AttributeType = constants.AttributeType;
const ActionType = constants.ActionType;
const Store = State.Store;

class Panel extends React.Component {
  state = {
    xAttribute: null,
    yAttribute: null,
    isLoadingLocations: true,
    locations: [],
    isLoading: false,
  }

  constructor(props) {
    super(props)
    this.onXChange = this.onXChange.bind(this);
    this.onYChange = this.onYChange.bind(this);
    this.onLocationChange = this.onLocationChange.bind(this);
    this.getLocations = this.getLocations.bind(this);
    this.onGraphButtonClick = this.onGraphButtonClick.bind(this);

    Store.subscribe(() => {
      var state = Store.getState();
      this.setState({locations: state.SELECTED_LOCATIONS});
    });
  }

  render () {
    var locationPanels =  this.state.locations.map((x) => {
        // var c = `list-group-item {x.color.class}`;
        var style = {
          backgroundColor: x.color.hex
        };
        return (
          <a key={x.id} className="list-group-item" style={style}>
            {x.label}
          </a>
          // <span className={c}>Default</span>
        )
      });

    return (
      <div className="">
        <div className="">
          {/* <Select.Async
            name="locations"
            multi={true}
            value={this.state.locations}
            isLoading={this.state.isLoadingLocations}
            loadOptions={this.getLocations}
            onChange={this.onLocationChange}
          /> */}
          {locationPanels}

          <h5> x axis</h5>
          <Select
            name="x-axis"
            value={this.state.xAttribute}
            options={AttributeType.enumValues}
            onChange={this.onXChange}
          />

          <h5> y axis</h5>
          <Select
              name="y-axis"
              value={this.state.yAttribute}
              options={AttributeType.enumValues}
              onChange={this.onYChange}
          />
          {this.state.isLoading ?
            <span className="text-center">
              <Spinner spinnerName="three-bounce"/>
            </span>
               : ''}

          <div className="checkbox">
              <label>
                <input type="checkbox" onChange={this.props.toggleEdges}/> Hide edges
              </label>
          </div>
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
    Store.dispatch({type: ActionType.SET_XAXIS_ATTRIBUTE, attribute: value});
  }

  onYChange(value) {
    this.setState({yAttribute: value});
    Store.dispatch({type: ActionType.SET_YAXIS_ATTRIBUTE, attribute: value})
  }

  onLocationChange(values) {
    this.setState({locations: values});
    Store.dispatch({type: ActionType.SET_LOCATIONS, locations: values})
  }

  onGraphButtonClick1(event) {
    event.preventDefault();
    var state = Store.getState();
    var locations = state['LOCATIONS'].map(x => x.value).join(',');
    axios.get('/api/graph', {params: {locations: locations}})
        .then((response) => {
      Store.dispatch({type: ActionType.SET_GRAPH, graph: response.data});
    })
    // .catch((error) => {
    //   console.error(error);
    // });
  }

  onGraphButtonClick(event) {
    event.preventDefault();
    var state = Store.getState();
    this.setState({isLoading: true});
    axios.post('/api/yelp', {locations:  state.SELECTED_LOCATIONS})
    .then((response) => {
      this.setState({isLoading: false});
      Store.dispatch(State.setGraph(response.data));
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
