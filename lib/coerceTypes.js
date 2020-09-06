const _ = require('lodash');

const supportedInputTypes = ['array', 'boolean', 'integer', 'null', 'number', 'object', 'string'];

module.exports.coerceTypes = (schema, { shallow = false } = {}) => {
  const inputTypes = _.castArray(schema.type);
  let coercedTypes = _.intersection(supportedInputTypes, inputTypes);

  const numberIndex = coercedTypes.indexOf('number');
  const hasNumber = numberIndex !== -1;
  if (hasNumber) {
    const hasInteger = coercedTypes.includes('integer');
    const expandedTypes = hasInteger ? ['decimal'] : ['decimal', 'integer'];
    coercedTypes.splice(numberIndex, 1, ...expandedTypes);
  }

  if (_.isEmpty(coercedTypes)) {
    coercedTypes = ['array', 'boolean', 'decimal', 'integer', 'null', 'object', 'string'];
  }

  if (!shallow && _.isArray(schema.allOf)) {
    const allAllOfTypes = schema.allOf.map((subSchema) => {
      const typedSubSchema = this.coerceTypes(subSchema);
      return typedSubSchema.type;
    });

    coercedTypes = _.intersection(coercedTypes, ...allAllOfTypes);
  }

  if (!shallow && _.isArray(schema.anyOf)) {
    const randomAnyOfs = _.shuffle(schema.anyOf).filter((subschema, index) => index === 0 || Math.random() < 0.5);

    randomAnyOfs.forEach((subschema, index) => {
      const supportedTypes = this.coerceTypes(subschema).type;
      const newTypes = _.intersection(coercedTypes, supportedTypes);

      // assumes each individual anyOf is independently compatible with the root schema so the first anyOf won't result in an empty type list
      if (index === 0 || newTypes.length !== 0) {
        coercedTypes = newTypes;
      }
    });
  }

  if (!shallow && _.isArray(schema.oneOf)) {
    const randomOneOf = _.sample(schema.oneOf);
    const supportedTypes = this.coerceTypes(randomOneOf).type;
    coercedTypes = _.intersection(coercedTypes, supportedTypes);
  }

  const typedSchema = {
    ...schema,
    type: coercedTypes,
  };

  return typedSchema;
};
