const _ = require('lodash');

const Mocker = function ({
  ...unsupportedOptions
} = {}) {
  const unsupportedOptionKeys = _.keys(unsupportedOptions);
  if (unsupportedOptionKeys.length > 0) {
    throw Error(`Unsupported option(s) "${unsupportedOptionKeys.join(',')}"`);
  }

  _.assign(this, {
    // options go here
  });
};

/* eslint-disable global-require */
Mocker.prototype = {
  ...require('./coerceTypes'),
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
