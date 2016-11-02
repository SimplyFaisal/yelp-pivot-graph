const React = require('react');
const ReactDom = require('react-dom');
const Modal = require('react-modal');
const redux = require('redux');
const axios = require('axios');
const State = require('./state');

const Store = State.Store;

const Panel = require('./panel.jsx');
const PivotGraph = require('./pivot.jsx');


class Map extends React.Component {
  constructor(props){
    super(props);
    this.map = null;
    this.heatmap = new google.maps.visualization.HeatmapLayer();
    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ['circle']
      },
      circleOptions: {
        fillColor: '#ffff00',
        fillOpacity: 1,
        strokeWeight: 5,
        clickable: true,
        editable: true,
        zIndex: 1
      }
    });

    google.maps.event.addListener(this.drawingManager, 'circlecomplete', (circle) => {
      var state = Store.getState();
      // We're limiting the user to 4 locations so ignore if they've reached the
      // the max.
      if (state.SELECTED_LOCATIONS.length == 4) {
        return;
      }
      circle.data = {
        id: +(new Date()),
        coordinates: circle.getCenter().toJSON(),
        radius: circle.getRadius(),
        label: `Location ${state.SELECTED_LOCATIONS.length}`
      };

      var div = document.createElement('div');

      function onInfoWindowButtonClick(value) {
        this.data.label = value;
        Store.dispatch(State.updateLocation(this.data));
      }

      ReactDom.render(<InfoWindowComponent
        onButtonClick={onInfoWindowButtonClick.bind(circle)}/>, div);


      var infoWindow = new google.maps.InfoWindow({
        content: div
      });

      Store.dispatch(State.addLocation(circle.data));

      circle.addListener('click', function(event) {
        console.log('click');
        infoWindow.setPosition(this.getCenter());
        infoWindow.open(this.getMap(), this);
      });

      circle.addListener('radius_changed', function(event) {
        this.data.radius = this.getRadius();
        Store.dispatch(State.updateLocation(this.data));
      });

      circle.addListener('center_changed', function(event) {
        this.data.coordinates = this.getCenter().toJSON();
        Store.dispatch(State.updateLocation(this.data));
      });

      circle.addListener('dblclick', function(event) {
        event.stop();
        console.log('double click');
        this.setMap(null);
        Store.dispatch(State.removeLocation(this.data));
      });
    });
  }

  render = () => {
    return (
      <div id="map">
          this is the map
      </div>
    )
  }

  componentDidMount = () => {
    if (!this.map) {
      var options =  {
        center: {lat: 40.7128 , lng: -74.0059},
        zoom: 12
      };
      this.map = new google.maps.Map(document.getElementById('map'), options);
      // google.maps.event.trigger(this.map, "resize");
    }
    this.drawingManager.setMap(this.map);
    var legend = document.createElement('div');
    ReactDom.render(<MapOverlayComponent/>, legend);
    this.map.controls[google.maps.ControlPosition.LEFT_CENTER].push(legend);
  }

  shouldComponentUpdate = () => {
    return false;
  }
}

class InfoWindowComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: this.props.defaultValue || '',
    }
  }

  render = () => {
    return (
      <div>
        <input type="text"
          value={this.state.value}
          onChange={this.onChange}/>
        <a
          className="btn btn-default btn-block btn-sm"
          onClick={this.onClick}
          >update label </a>
      </div>
    )
  }

  onChange = (event) => {
    event.preventDefault();
    var value = event.target.value;
    this.setState({value: value});
    console.log(this.state);
  }

  onClick = (event) => {
    event.preventDefault();
    this.props.onButtonClick(this.state.value);
  }
}

class MapOverlayComponent extends React.Component {
   constructor(props) {
     super(props);
   }

   render = () => {
     return (
       <div id="map-overlay">
         <div className="panel panel-default">
            <div className="panel-body">
              Basic panel
            </div>
        </div>
      </div>
     );
   }

   componentDidMount = () => {
     console.log('component did mount');
   }
}


class App extends React.Component {

  state = {
    isModalOpen: false,
    businesses: []
  }

  constructor(props) {
    super(props);

    Store.subscribe(() => {
      var state = Store.getState();
      this.setState({businesses: state.BUSINESSES});
    });
  }

  render = () => {
    return (
      <div className="container-fluid">
        <Modal
          isOpen={this.state.isModalOpen}
          onRequestClose={this.closeModal}>

          <Map/>
        </Modal>
        <div className="col-md-3">
          <div id="panel-container">
            <div className="panel panel-danger">
              <div className="panel-heading">
                <h3 className="panel-title">Yelp Pivot</h3>
                <button
                  type="button"
                  className="btn btn-sm btn-default"
                  onClick={this.openModal}>
                  <span className="glyphicon glyphicon-map-marker" aria-hidden="true"></span>
                </button>
              </div>
              <div className="panel-body">
                <Panel/>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div id="pivot-graph-container">
            <PivotGraph/>
          </div>
        </div>
        <div className="col-md-2 col-md-offset-1">
          <ListView items={this.state.businesses}/>
        </div>
      </div>
    )
  }

  closeModal = () => {
    this.setState({isModalOpen: false});
  }

  openModal = () => {
    this.setState({isModalOpen: true});
  }
}

class ListView extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    var listItems = this.props.items.map((business) => {
      return (
        <a className="list-group-item">
          <h5 className="list-group-item-heading">{business.name} </h5>
          <p className="list-group-item-text"> {business.city}</p>
        </a>
      )
    });
    return (
      <div className="list-group">
        {listItems}
      </div>
    )
  }
}

ReactDom.render(<App/>, document.getElementById('app-frame'));
