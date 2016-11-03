const React = require('react');
const Select = require('react-select');
const Promise = require('bluebird');
const axios = require('axios');

const state = require('./state');
const constants = require('./constants');

const Store = state.Store;
const AttributeType = constants.AttributeType;
const ActionType = constants.ActionType;

class Panel extends React.Component {
  state = {
    xAttribute: null,
    yAttribute: null,
    isLoadingLocations: true,
    locations: [],
  }

  constructor(props) {
    super(props)
    this.onXChange = this.onXChange.bind(this);
    this.onYChange = this.onYChange.bind(this);
    this.onLocationChange = this.onLocationChange.bind(this);
    this.getLocations = this.getLocations.bind(this);
    this.onGraphButtonClick = this.onGraphButtonClick.bind(this);
    this.geocoder = new google.maps.Geocoder;

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

          <a
            className="btn btn-danger btn-lg btn-block"
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
    var locations = state.SELECTED_LOCATIONS;

    var promises = locations.map((x) => {
      return new Promise((resolve, reject) => {
        this.geocoder.geocode({location: x.coordinates}, (results, status) => {
          if (status === 'OK') {
            resolve(results);
          } else {
            reject(status);
          }
        });
      })
    });

    Promise.all(promises).then((results) => {
      results.forEach((result, i) => {
        locations[i].address = result[0].formatted_address;
      });
      axios.post('/api/yelp', {locations: locations})
        .then((response) => {
        console.log(response.data);
      });
    });

    // axios.get('/api/graph', {params: {locations: locations}})
    //     .then((response) => {
    //   Store.dispatch({type: ActionType.SET_GRAPH, graph: response.data});
    // })
    // .catch((error) => {
    //   console.error(error);
    // });
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
