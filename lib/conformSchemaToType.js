const getConformedKeywords = function (singleTypedSchema) {
  switch (singleTypedSchema.type) {
    case 'array': return this.getConformedArrayKeywords(singleTypedSchema);
    case 'decimal':
    case 'integer': return this.getConformedNumberKeywords(singleTypedSchema);
    case 'object': return this.getConformedObjectKeywords(singleTypedSchema);
    case 'string': return this.getConformedStringKeywords(singleTypedSchema);
    default: return {};
  }
};

const conformSchemaToType = function (singleTypedSchema) {
  const { type } = singleTypedSchema;

  return {
    type,
    ...this.getConformedKeywords(singleTypedSchema),
  };
};

module.exports = {
  getConformedKeywords,
  conformSchemaToType,
};
