const { defaultMocker } = require('./lib/mocker');

module.exports = {
  schemaToData: defaultMocker.schemaToData.bind(defaultMocker),
  // TODO: add a function that lets the end user create 'schemaToData' with custom defaults
};
