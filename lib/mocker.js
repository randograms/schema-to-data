const _ = require('lodash');

const Mocker = function ({
  ...unsupportedOptions
} = {}) {
  const unsupportedOptionKeys = _.keys(unsupportedOptions);
  if (unsupportedOptionKeys.length > 0) {
    throw Error(`Unsupported option(s) "${unsupportedOptionKeys.join(',')}"`);
  }

  const defaultMinNumber = -100000;
  const defaultMaxNumber = 100000;

  _.assign(this, {
    // TODO: allow these to be configured, and put them under a "defaults" key
    defaultMinStringLength: 0,
    defaultStringLengthRange: 20,
    defaultMinNumber,
    defaultMaxNumber,
    numberRange: defaultMaxNumber - defaultMinNumber,
    defaultMinArrayItems: 0,
    defaultArrayLengthRange: 20,
    defaultPotentialExtraProperties: 3,
  });
};

/* eslint-disable global-require */
Mocker.prototype = {
  ...require('./coerceSchema'),
  ...require('./coerceTypes'),
  ...require('./conformSchemaToType'),
  ...require('./generateArray'),
  ...require('./generateBoolean'),
  ...require('./generateData'),
  ...require('./generateNumber'),
  ...require('./generateObject'),
  ...require('./generateString'),
  ...require('./selectType'),
};
/* eslint-enable global-require */

module.exports = {
  Mocker,
  defaultMocker: new Mocker(),
};
