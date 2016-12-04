// 100% of the code in this file was written by us. 0% was imported.

const React = require('react');
const ReactDom = require('react-dom');
const Modal = require('react-modal');
const redux = require('redux');
const axios = require('axios');
const State = require('./state');


const Store = State.Store;

const Panel = require('./panel.jsx');
const PivotGraph = require('./pivot.jsx');
const COLORS = [
  {
    class: 'primary',
    hex: '#d32323'
  },
  {
    class: 'info',
    hex: '#f9bc74'
  },
  {
    class: 'success',
    hex: '#41a700'
  },
  {
    class: 'warning',
    hex: '#0097ec'
  }
];

  // $(".gmnoprint").each(function(){
  //   alert("inthere!");
  //   var newObj = $(this).find("[title='Draw a circle']");
  //   newObj.attr("id", "circle");

  //   // ID the Hand button
  //   newObj = $(this).find("[title='Stop drawing']");
  //   newObj.attr('id', 'hand');
  // });

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
        clickable: true,
        editable: true,
        zIndex: 1
      }
    });
    this.colors = COLORS;

    axios.get('/api/heatmap').then((response) => {
      this.heatmap.setData(response.data.map((x) => {
        return new google.maps.LatLng(x.latitude, x.longitude);
      }));
      this.heatmap.setMap(this.map);
    })


    google.maps.event.addListener(this.drawingManager, 'circlecomplete', (circle) => {
      var state = Store.getState();
      // We're limiting the user to 4 locations so ignore if they've reached the
      // the max.
      if (state.SELECTED_LOCATIONS.length == 4) {
        circle.setMap(null);
        return;
      }
      var color = this.colors.pop();
      circle.data = {
        id: +(new Date()),
        coordinates: circle.getCenter().toJSON(),
        radius: circle.getRadius(),
        label: `Location ${state.SELECTED_LOCATIONS.length}`,
        color: color
      };

      circle.setOptions({
        fillColor: color.hex
      });
      this.configureCircle(circle);
      Store.dispatch(State.addLocation(circle.data));
    });

    var stepOne = function() {
      var wholeDiv = $($('<div class = "step1">At the top of the map, ensure that you have the "Draw a circle" tool selected.<br></div>'));
      var pic = $($('<img id="dynamic">'));
      pic.attr('src', 'selectcircle.gif');
      wholeDiv.append(pic);
      return wholeDiv;
    };

     var stepTwo = function() {
      var wholeDiv = $($('<div class = "step1">Determine your first location of interest and draw a circle around it. You can use the heat map to find out where bundles of restaurants are located.<br></div>'));
      var pic = $($('<img id="dynamic">'));
      pic.attr('src', 'drawcircle.gif');
      wholeDiv.append(pic);
      return wholeDiv;
    };
    var stepThree = function() {
      var wholeDiv = $($('<div class = "step1">Switch to the "hand grab" tool and click on the circle you just created to label it.<br></div>'));
      var pic = $($('<img id="dynamic">'));
      pic.attr('src', 'labelcircle.gif');
      wholeDiv.append(pic);
      return wholeDiv;
    };
    var stepFour = function() {
      var wholeDiv = $($('<div class = "step1">You can continue this process for up to four locations to compare in your graph.<br></div>'));
      var pic = $($('<img id="dynamic">'));
      pic.attr('src', 'addmore.gif');
      wholeDiv.append(pic);
      return wholeDiv;
    };

    var tour = new Tour({
  steps: [
  {
    title: "Select Circle Tool",
    content: stepOne
  },
  {
    title: "Draw Your First Circle",
    content: stepTwo
  },
  {
    title: "Label Your First Circle",
    content: stepThree
  },
  {
    title: "Add More Circles",
    content: stepFour
  }

], orphan: true, backdrop: true
});

// Initialize the tour
tour.init();

// Start the tour
tour.start();
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
        zoom: 4
      };
      this.map = new google.maps.Map(document.getElementById('map'), options);
      google.maps.event.trigger(this.map, "resize");
    }
    var state = Store.getState();
    this.drawingManager.setMap(this.map);
    var legend = document.createElement('div');
    ReactDom.render(<MapOverlayComponent/>, legend);
    this.map.controls[google.maps.ControlPosition.LEFT_CENTER].push(legend);

    var locations = state.SELECTED_LOCATIONS.forEach((location) => {
      var circle = new google.maps.Circle({
        radius: location.radius,
        center: location.coordinates,
        clickable: true,
        editable: true,
        zIndex: 1,
        fillColor: location.color.hex
      });
      circle.data = location;
      this.configureCircle(circle);
      circle.setMap(this.map);
    });
  }

  configureCircle = (circle) => {
    var div = document.createElement('div');
    var colors = this.colors;

    var infoWindow = new google.maps.InfoWindow();

    function onInfoWindowButtonClick(value) {
      this.data.label = value;
      Store.dispatch(State.updateLocation(this.data));
    }

    function onInfoWindowKeyPress(event) {
      if (event.charCode == 13) {
        this.close();
      }
    }

    ReactDom.render(<InfoWindowComponent
      onButtonClick={onInfoWindowButtonClick.bind(circle)}
      onKeyPress={onInfoWindowKeyPress.bind(infoWindow)}
      defaultValue={circle.data.label}/>, div);

    infoWindow.setContent(div);



    circle.addListener('click', function(event) {
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

    circle.addListener('rightclick', function(event) {
      event.stop();
      this.setMap(null);
      colors.push(this.data.color);
      Store.dispatch(State.removeLocation(this.data.id));
    });
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
          onChange={this.onChange}
          onKeyPress={this.onKeyPress}/>
        <a
          className="btn btn-primary btn-block btn-sm"
          onClick={this.onClick}
          >update label </a>
      </div>
    )
  }

  onChange = (event) => {
    event.preventDefault();
    var value = event.target.value;
    this.setState({value: value});
  }

  onClick = (event) => {
    event.preventDefault();
    this.props.onButtonClick(this.state.value);
  }

  onKeyPress = (event) => {
    this.props.onKeyPress(event);
    this.props.onButtonClick(this.state.value);
  }
}

class MapOverlayComponent extends React.Component {
  state = {
    locations: []
  }
   constructor(props) {
     super(props);
     Store.subscribe(() => {
       var state = Store.getState();
       this.setState({locations: state.SELECTED_LOCATIONS});
     });
   }

   render = () => {
     var items = this.state.locations.map((x) => {
       var style = {
         backgroundColor: x.color.hex
       };
       return (
         <a key={x.id} className="list-group-item" style={style}>
           {x.label}
         </a>
       )
     })
     return (
       <div id="map-overlay">
          <div className="list-group">
            {items}
          </div>
      </div>
     );
   }

   componentDidMount = () => {
    //  console.log('component did mount');
   }
}


class App extends React.Component {

  state = {
    isModalOpen: false,
    selectedBusinesses: [],
    hideEdges: false,
  }

  constructor(props) {
    super(props);
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
                <h3 className="panel-title">Yelp Pivot Graph</h3>
                <button
                  type="button"
                  className="btn btn-sm btn-default"
                  onClick={this.openModal}>
                  <span className="glyphicon glyphicon-map-marker" aria-hidden="true"></span>
                </button>
              </div>
              <div className="panel-body">
                <Panel toggleEdges={this.toggleEdges}/>
              </div>
            </div>
          </div>

          <div className="panel panel-danger">
            <div className="panel-heading">
              <h3 className="panel-title">About</h3>
            </div>
            <div className="panel-body">
              Data is everywhere, including the restaurants we frequent every day. The Yelp pivot graph is our
              attempt to understand as much of that data as possible and present it in a concise way.<br /><br />
              The graph aggregates restaurants in selected cities along variables that are predefined by the user, creating a simple scatterplot.
              You could see how many Italian restaurants have fancy attire, or see how many 5 star restaurants have
              a high number of reviews.<br /><br />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div id="pivot-graph-container">
            <PivotGraph
              onNodeClick={this.setSelectedBusinesses}
              hideEdges={this.state.hideEdges}/>
          </div>
        </div>
        <div className="col-md-2 col-md-offset-1">
          <ListView items={this.state.selectedBusinesses}/>
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

  setSelectedBusinesses = (businesses) => {
    this.setState({selectedBusinesses: businesses});
  }

  toggleEdges = (event) => {
    this.setState({hideEdges: event.target.checked});
  }
}

class ListView extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    if (this.props.items.length == 0) {
      return (
        <div className="panel panel-default">
          <div className="panel-body">
          click on a node to show restaurants
          </div>
        </div>
      )
    }
    var selectedLocations = Store.getState().SELECTED_LOCATIONS;
    var colorMap = {};
    selectedLocations.forEach((location) => {
      colorMap[location.id] = location.color.hex;
    });
    var listItems = this.props.items.map((business) => {
      var name = business.name.split(' ').join('-').toLowerCase();
      var city = business.city.split(' ').join('-').toLowerCase();
      var link = `https://www.yelp.com/biz/${name}-${city}`;
      var style = {
        backgroundColor: colorMap[business.location_id]
      };
      return (
        <a
          className="list-group-item"
          key={business.business_id}
          href={link}
          style={style}
          target='_blank'>
          <h5 className="list-group-item-heading"><b>{business.name} </b></h5>
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
