const redux = require('redux');
const constants = require('./constants');

var AttributeType = constants.AttributeType;
var ActionType = constants.ActionType;

var initialState = {
  YAXIS_ATTRIBUTE: null,
  XAXIS_ATTRIBUTE: null,
  LOCATIONS: null,
  GRAPH: null
};
var Store = redux.createStore(reducer, initialState);

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

exports.Store = Store;
