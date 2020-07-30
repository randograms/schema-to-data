module.exports.coerceSchema = function (schema) {
  if (schema === false) {
    throw Error('Cannot generate data for a "false" literal schema');
  }

  const typedSchema = this.coerceTypes(schema);
  const singleTypedSchema = this.selectType(typedSchema);
  const conformedSchema = this.conformSchemaToType(singleTypedSchema);

  return conformedSchema;
};
