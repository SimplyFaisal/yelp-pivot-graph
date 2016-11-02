const redux = require('redux');
const constants = require('./constants');

const AttributeType = constants.AttributeType;
const ActionType = constants.ActionType;

var initialState = {
  YAXIS_ATTRIBUTE: null,
  XAXIS_ATTRIBUTE: null,
  LOCATIONS: null,
  GRAPH: null,
  SELECTED_LOCATIONS: [],
  BUSINESSES: []
};

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
    case ActionType.ADD_LOCATION:
      // TODO(simplyfaisal): figure out the correct way to mutate the array.
      return Object.assign({}, state, {
        SELECTED_LOCATIONS: state.SELECTED_LOCATIONS.concat([action.location])
      });
      break;
    case ActionType.REMOVE_LOCATION:
      return Object.assign({}, state, {
        SELECTED_LOCATIONS: state.SELECTED_LOCATIONS.
          filter(x => x.id != action.id)
      });
      break;
    case ActionType.UPDATE_LOCATION:
      return Object.assign({}, state, {
        SELECTED_LOCATIONS: state.SELECTED_LOCATIONS.map((location) => {
          if (location.id == action.location.id) {
            return action.location;
          }
          return location;
        })
      });
      break;
    case ActionType.SET_BUSINESSES:
      return Object.assign({}, state, {
        BUSINESSES: action.businesses
      });
      break;
    default:
      return state;
      break
  }
}


exports.addLocation = function(location) {
  return {type: ActionType.ADD_LOCATION, location: location};
};

exports.removeLocation = function(id) {
  return {type: ActionType.REMOVE_LOCATION, id: id};
};

exports.updateLocation = function(location) {
  return {type: ActionType.UPDATE_LOCATION, location: location};
};

exports.setBusinesses = function(businesses) {
  return {type:ActionType.SET_BUSINESSES, businesses: businesses};
};

exports.Store = redux.createStore(reducer, initialState);;
