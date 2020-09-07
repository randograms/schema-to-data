const _ = require('lodash');

const supportedFormats = _.keyBy([
  'date',
  'date-time',
  'email',
  'ipv4',
  'ipv6',
  'time',
  'uuid',
]);

module.exports.getConformedStringKeywords = function (singleTypedSchema) {
  const { DEFAULTS } = this;

  const { format } = singleTypedSchema;
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
    format: _.isString(format) && supportedFormats[format] !== undefined ? format : null,
    minLength,
    maxLength,
  };
};
