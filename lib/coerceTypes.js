const _ = require('lodash');

const supportedInputTypes = ['array', 'boolean', 'integer', 'null', 'number', 'object', 'string'];

module.exports.coerceTypes = (schema) => {
  let coercedTypes;
  let allOfWithCoercedTypes = null;
  let anyOfWithCoercedTypes = null;
  let oneOfWithCoercedTypes = null;

  const inputTypes = _.castArray(schema.type);
  coercedTypes = _.intersection(supportedInputTypes, inputTypes);

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

  if (_.isArray(schema.allOf)) {
    allOfWithCoercedTypes = schema.allOf.map((subSchema) => this.coerceTypes(subSchema));
    coercedTypes = _.intersection(coercedTypes, ..._.map(allOfWithCoercedTypes, 'type'));
  }

  if (_.isArray(schema.anyOf)) {
    anyOfWithCoercedTypes = schema.anyOf.map((subSchema) => this.coerceTypes(subSchema));

    const allSupportedAnyOfTypes = _.union(..._.map(anyOfWithCoercedTypes, 'type'));
    coercedTypes = _.intersection(coercedTypes, allSupportedAnyOfTypes);
  }

  if (_.isArray(schema.oneOf)) {
    oneOfWithCoercedTypes = schema.oneOf.map((subSchema) => this.coerceTypes(subSchema));

    const allSupportedOneOfTypes = _.union(..._.map(oneOfWithCoercedTypes, 'type'));
    coercedTypes = _.intersection(coercedTypes, allSupportedOneOfTypes);
  }

  const typedSchema = {
    ...schema,
    type: coercedTypes,
    allOf: allOfWithCoercedTypes,
    anyOf: anyOfWithCoercedTypes,
    oneOf: oneOfWithCoercedTypes,
  };

  return typedSchema;
};
