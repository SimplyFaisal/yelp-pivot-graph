const enumify = require('enumify');
import * as d3 from "d3";

class AttributeType extends enumify.Enum {}

AttributeType.initEnum({
  STARS: {
    label: 'Stars',
    value: 'STARS',
    scale: () => {
      return d3.scaleLinear();
    },
    f: (d) => {
      return d.value.stars;
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
      return d3.scaleLinear();
    },
    f: (d) => {
      return d.value.review_count;
    }
  },
  ATTIRE: {
    label: 'Attire',
    value: 'ATTIRE',
    scale: () => {
      return d3.scaleOrdinal();
    },
    f: (d) => {
      return d.value.attributes.Attire || 'unknown';
    }
  },
  PRICE_RANGE: {
    label: 'Price Range',
    value: 'PRICE_RANGE',
    scale: () => {
      return d3.scaleLinear();
    },
    f: (d) => {
      return d.value.attributes['Price Range'] || 'unknown';
    }
  },
  DELIVERY: {
    label: 'Delivery',
    value: 'DELIVERY',
    scale: () => {
      return;
    },
    f: (d) => {
      return d.value.attributes.Delivery || 'unknown';
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
