const { defaultMocker, Mocker } = require('./lib/mocker');

module.exports = {
  schemaToData: Mocker.extractSchemaToData(defaultMocker),
  createWithDefaults: (options) => Mocker.extractSchemaToData(new Mocker(options)),
};
