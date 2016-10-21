const enumify = require('enumify');

class AttributeType extends enumify.Enum {}

AttributeType.initEnum({
  STARS: {label: 'Stars', value: 'STARS'},
  CATEGORIES: {label: 'Categories', value: 'CATEGORIES'},
  REVIEW_COUNT: {label: 'Review Count', value: 'REVIEW_COUNT'},
  ATTIRE: {label: 'Attire', value: 'ATTIRE'},
  PRICE_RANGE: {label: 'Price Range', value: 'PRICE_RANGE'},
  DELIVERY: {label: 'Delivery', value: 'DELIVERY'}
});

class ActionType extends enumify.Enum {}

ActionType.initEnum({
  SET_YAXIS_ATTRIBUTE: {},
  SET_XAXIS_ATTRIBUTE: {},
  SET_LOCATIONS: {},
  SET_GRAPH: {}
});

exports.AttributeType = AttributeType;
exports.ActionType = ActionType;
