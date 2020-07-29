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

module.exports = { Mocker };
