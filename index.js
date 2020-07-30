const { defaultMocker } = require('./lib/mocker');

const schemaToData = (schema) => {
  const coercedSchema = defaultMocker.coerceSchema(schema);
  const generatedData = defaultMocker.generateData(coercedSchema);

  return generatedData;
};

module.exports = { schemaToData };
