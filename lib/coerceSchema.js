module.exports.coerceSchema = function (schema) {
  if (schema === false) {
    throw Error('Cannot generate data for a "false" literal schema');
  }

  const typedSchema = this.coerceTypes(schema);
  const singleTypedSchema = this.selectType(typedSchema);
  const mergedSchema = this.mergeCombinedSchemasForType(singleTypedSchema);
  const conformedSchema = this.conformSchemaToType(mergedSchema);

  return conformedSchema;
};
