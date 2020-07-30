module.exports.schemaToData = function (schema) {
  const coercedSchema = this.coerceSchema(schema);
  const generatedData = this.generateData(coercedSchema);

  return generatedData;
};
