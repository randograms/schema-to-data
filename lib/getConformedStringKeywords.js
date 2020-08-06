const _ = require('lodash');

module.exports.getConformedStringKeywords = function (singleTypedSchema) {
  const { DEFAULTS } = this;

  let { minLength } = singleTypedSchema;

  const isUsingDefaultMinLength = !_.isInteger(minLength);
  if (isUsingDefaultMinLength) {
    minLength = DEFAULTS.minStringLength;
  }

  const { maxLength = (minLength + DEFAULTS.stringLengthRange) } = singleTypedSchema;

  if (isUsingDefaultMinLength && minLength > maxLength) {
    minLength = maxLength;
  }

  if (maxLength < minLength) {
    throw Error('Cannot generate data for conflicting "minLength" and "maxLength"');
  }

  return {
    minLength,
    maxLength,
  };
};
