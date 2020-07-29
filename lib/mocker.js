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
  ...require('./generateBoolean'),
};
/* eslint-enable global-require */

module.exports = {
  Mocker,
  defaultMocker: new Mocker(),
};
