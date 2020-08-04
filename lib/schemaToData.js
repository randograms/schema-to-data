module.exports.schemaToData = function (schema = true) {
  const coercedSchema = this.coerceSchema(schema);
  const generatedData = this.generateData(coercedSchema);

  return generatedData;
};
