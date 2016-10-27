var React = require('react');
var ReactDom = require('react-dom');
var Modal = require('react-modal');
var redux = require('redux');

var Store = require('./state').Store;
var Panel = require('./panel.jsx');
var PivotGraph = require('./pivot.jsx');

class Map extends React.Component {
  constructor(props){
    super(props);
    this.map = null;
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
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
      };
      this.map = new google.maps.Map(document.getElementById('map'), options);
      google.maps.event.trigger(this.map, "resize");
    }
  }
}


class App extends React.Component {

  state = {
    isModalOpen: false,
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
        <div className="col-md-9">
          <div id="pivot-graph-container">
            <PivotGraph/>
          </div>
        </div>
      </div>
    )
  }

  componentDidMount = () => {

  }

  closeModal = () => {
    this.setState({isModalOpen: false});
  }

  openModal = () => {
    this.setState({isModalOpen: true});
  }
}

ReactDom.render(<App/>, document.getElementById('app-frame'));
