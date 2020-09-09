const _ = require('lodash');

module.exports.generateData = function (conformedSchema) {
  const {
    type,
    const: constant,
    enum: enumeration,
  } = conformedSchema;

  if (constant !== undefined) {
    return _.cloneDeep(constant);
  }

  if (enumeration !== null) {
    const randomEnumValue = _.sample(enumeration);
    return _.cloneDeep(randomEnumValue);
  }

  switch (type) {
    case 'array': return this.generateArray(conformedSchema);
    case 'boolean': return this.generateBoolean();
    case 'decimal': return this.generateNumber(conformedSchema);
    case 'integer': return this.generateNumber(conformedSchema);
    case 'object': return this.generateObject(conformedSchema);
    case 'string': return this.generateString(conformedSchema);
    default: return null;
  }
};
