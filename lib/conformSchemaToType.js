const _ = require('lodash');

const isType = (value, type) => {
  switch (type) {
    case 'array': return _.isArray(value);
    case 'boolean': return _.isBoolean(value);
    case 'decimal': return _.isNumber(value);
    case 'integer': return _.isInteger(value);
    case 'object': return !_.isNull(value) && !_.isArray(value) && _.isObject(value);
    case 'string': return _.isString(value);
    default: return _.isNull(value);
  }
};

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
  const { type, enum: enumeration } = singleTypedSchema;

  return {
    type,
    const: singleTypedSchema.const,
    enum: _.isArray(enumeration) ? singleTypedSchema.enum.filter((value) => isType(value, type)) : null,
    ...this.getConformedKeywords(singleTypedSchema),
  };
};

module.exports = {
  getConformedKeywords,
  conformSchemaToType,
};
