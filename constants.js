const enumify = require('enumify');
import * as d3 from "d3";

class AttributeType extends enumify.Enum {}

AttributeType.initEnum({
  STARS: {
    label: 'Stars',
    value: 'STARS',
    scale: () => {
      return;
    },
    f: (d) => {
      return d;
    }
  },
  CATEGORIES: {
    label: 'Categories',
    value: 'CATEGORIES',
    scale: () => {

    },
    f: (d) => {
      return d;
    }
  },
  REVIEW_COUNT: {
    label: 'Review Count',
    value: 'REVIEW_COUNT',
    scale: () => {
      return;
    },
    f: (d) => {
      return d;
    }
  },
  ATTIRE: {
    label: 'Attire',
    value: 'ATTIRE',
    scale: () => {
      return;
    },
    f: (d) => {
      return d;
    }
  },
  PRICE_RANGE: {
    label: 'Price Range',
    value: 'PRICE_RANGE',
    scale: () => {
      return;
    },
    f: (d) => {
      return d;
    }
  },
  DELIVERY: {
    label: 'Delivery',
    value: 'DELIVERY',
    scale: () => {
      return;
    },
    f: (d) => {
      return d;
    }
  }
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
