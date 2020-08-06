const _ = require('lodash');

module.exports.generateNumber = (numberSchema) => {
  // schema is guaranteed to have a "decimal" or "integer" type
  // minimum and maximum are guaranteed to exist
  const {
    type,
    minimum,
    maximum,
  } = numberSchema;
  const isDecimal = type === 'decimal';

  return _.random(minimum, maximum, isDecimal);
};
