const _ = require('lodash');

const Mocker = function ({
  // array
  arrayItemsRange = 20,
  maxExtraAdditionalItems = 10,
  minArrayItems = 0,
  // number
  maxNumber = 1000000000,
  minNumber = -1000000000,
  // object
  maxExtraAdditionalProperties = 10,
  minObjectProperties = 0,
  optionalPropertyPrioritization = 0.8,
  // string
  minStringLength = 0,
  stringLengthRange = 500,
  // other
  onUnknownPattern = null,
  ...unsupportedOptions
} = {}) {
  const errorMessages = [];

  _.forEach(
    {
      arrayItemsRange,
      maxExtraAdditionalItems,
      minArrayItems,
      maxExtraAdditionalProperties,
      minObjectProperties,
      minStringLength,
      stringLengthRange,
    },
    (optionValue, optionName) => {
      const isNonNegativeInteger = _.isInteger(optionValue) && optionValue >= 0;
      if (!isNonNegativeInteger) {
        errorMessages.push(`"${optionName}" must be a non-negative integer`);
      }
    },
  );

  if (!_.isNumber(maxNumber)) {
    errorMessages.push('"maxNumber" must be a number');
  }

  if (!_.isNumber(minNumber)) {
    errorMessages.push('"minNumber" must be a number');
  }

  if (minNumber > maxNumber) {
    errorMessages.push('"minNumber" must be less than or equal to "maxNumber"');
  }

  if (
    !_.isNumber(optionalPropertyPrioritization)
    || optionalPropertyPrioritization < 0
    || optionalPropertyPrioritization > 1
  ) {
    errorMessages.push('"optionalPropertyPrioritization" must be a number in the range [0, 1]');
  }

  if (onUnknownPattern !== null && !_.isFunction(onUnknownPattern)) {
    errorMessages.push('"onUnknownPattern" must be a function');
  }

  const unsupportedOptionKeys = _.keys(unsupportedOptions);
  if (unsupportedOptionKeys.length > 0) {
    errorMessages.push(`Unsupported option(s) "${unsupportedOptionKeys.join(',')}"`);
  }

  if (errorMessages.length > 0) {
    throw Error(`Error(s) setting up defaults: ${errorMessages.join(', ')}`);
  }

  this.OPTIONS = {
    onUnknownPattern,
  };

  this.DEFAULTS = {
    // array
    arrayItemsRange,
    maxExtraAdditionalItems,
    minArrayItems,
    // number
    maxNumber,
    minNumber,
    // object
    maxExtraAdditionalProperties,
    minObjectProperties,
    optionalPropertyPrioritization,
    // string
    minStringLength,
    stringLengthRange,
  };
};

Mocker.extractSchemaToData = (mocker) => {
  const schemaToData = mocker.schemaToData.bind(mocker);
  schemaToData.getDefaults = () => ({ ...mocker.DEFAULTS });

  return schemaToData;
};

/* eslint-disable global-require */
Mocker.prototype = {
  ...require('./coerceSchema'),
  ...require('./coerceTypes'),
  ...require('./conformSchemaToType'),
  ...require('./generateArray'),
  ...require('./generateBoolean'),
  ...require('./generateData'),
  ...require('./generateDefaultNestedSchema'),
  ...require('./generateNumber'),
  ...require('./generateObject'),
  ...require('./generateString'),
  ...require('./getConformedArrayKeywords'),
  ...require('./getConformedNumberKeywords'),
  ...require('./getConformedObjectKeywords'),
  ...require('./getConformedStringKeywords'),
  ...require('./mergeCombinedSchemas'),
  ...require('./schemaToData'),
  ...require('./selectType'),
};
/* eslint-enable global-require */

module.exports = {
  Mocker,
  defaultMocker: new Mocker(),
};
