const _ = require('lodash');

module.exports.generateObject = function (objectSchema) {
  // "properties" will have been coerced to only have properties that should be generated
  const { properties } = objectSchema;

  const mockObject = _.mapValues(properties, (coercedPropertySchema) => this.generateData(coercedPropertySchema));
  return mockObject;
};
