const _ = require('lodash');

const supportedInputTypes = ['null', 'string', 'number', 'integer', 'boolean', 'array', 'object'];

module.exports.coerceTypes = (schema) => {
  const inputTypes = _.castArray(schema.type);
  let coercedTypes = _.intersection(inputTypes, supportedInputTypes);

  const numberIndex = coercedTypes.indexOf('number');
  const hasNumber = numberIndex !== -1;
  if (hasNumber) {
    const hasInteger = coercedTypes.includes('integer');
    const expandedTypes = hasInteger ? ['decimal'] : ['decimal', 'integer'];
    coercedTypes.splice(numberIndex, 1, ...expandedTypes);
  }

  if (_.isEmpty(coercedTypes)) {
    coercedTypes = ['null', 'string', 'decimal', 'integer', 'boolean', 'array', 'object'];
  }

  if (_.isArray(schema.allOf)) {
    const allAllOfTypes = schema.allOf.map((subSchema) => {
      const typedSubSchema = this.coerceTypes(subSchema);
      return typedSubSchema.type;
    });

    coercedTypes = _.intersection(coercedTypes, ...allAllOfTypes);
  }

  const typedSchema = {
    ...schema,
    type: coercedTypes,
  };

  return typedSchema;
};
