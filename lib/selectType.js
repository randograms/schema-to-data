const _ = require('lodash');

const updateNestedTypes = (typedSchema, selectedType) => {
  const {
    allOf,
    anyOf,
    oneOf,
  } = typedSchema;

  return {
    ...typedSchema,
    type: selectedType,
    allOf: allOf === null ? null : allOf.map((subschema) => updateNestedTypes(subschema, selectedType)),
    anyOf: anyOf === null
      ? null
      : (
        anyOf
          .filter(({ type }) => type.includes(selectedType))
          .map((subschema) => updateNestedTypes(subschema, selectedType))
      ),
    oneOf: oneOf === null
      ? null
      : (
        oneOf
          .filter(({ type }) => type.includes(selectedType))
          .map((subschema) => updateNestedTypes(subschema, selectedType))
      ),
  };
};

module.exports.selectType = (typedSchema) => {
  const selectedType = _.sample(typedSchema.type);

  const singleTypedSchema = updateNestedTypes(typedSchema, selectedType);
  return singleTypedSchema;
};
