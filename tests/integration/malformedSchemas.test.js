const { mapBasicSchemas } = require('./helpers/commonSchemas');

describe('malformed schemas', function () {
  testSchema({
    scenario: 'when type is an empty array',
    schema: {
      itAlwaysReturns: 'data',
      type: [],
    },
    alternateBaseValidationSchema: {},
    runCount: 40,
    theSchemaIsInvalidBecause: 'data.type should be equal to one of the allowed values',
    itValidatesAgainst: mapBasicSchemas(({ schemaDescriptor, basicSchema }) => ({
      itSometimesReturns: `${schemaDescriptor}`,
      ...basicSchema,
    })),
  });

  testSchema({
    scenario: 'when type is not a string or array',
    schema: {
      itAlwaysReturns: 'data',
      type: {},
    },
    runCount: 40,
    theSchemaIsInvalidBecause: 'data.type should be equal to one of the allowed values',
    itValidatesAgainst: mapBasicSchemas(({ schemaDescriptor, basicSchema }) => ({
      itSometimesReturns: `${schemaDescriptor}`,
      ...basicSchema,
    })),
  });

  testSchema({
    scenario: 'when "minLength" and "maxLength" conflict',
    schema: {
      itThrowsTheError: 'Cannot generate data for conflicting "minLength" and "maxLength"',
      type: 'string',
      minLength: 5,
      maxLength: 4,
    },
  });

  testSchema({
    scenario: 'when "minimum" and "maximum" conflict',
    schema: {
      itThrowsTheError: 'Cannot generate data for conflicting "minimum" and "maximum"',
      type: 'number',
      minimum: 5,
      maximum: 4,
    },
  });

  testSchema({
    scenario: 'when "minItems" and "maxItems" conflict',
    schema: {
      itThrowsTheError: 'Cannot generate data for conflicting "minItems" and "maxItems"',
      type: 'array',
      minItems: 7,
      maxItems: 6,
    },
  });

  testSchema({
    scenario: 'when "minProperties" and "maxProperties" conflict',
    schema: {
      itThrowsTheError: 'Cannot generate data for conflicting "minProperties" and "maxProperties"',
      type: 'object',
      minProperties: 7,
      maxProperties: 6,
    },
  });

  testSchema({
    scenario: 'when the "maxProperties" and the length of "required" conflict',
    schema: {
      itThrowsTheError: 'Cannot generate data for conflicting "required" and "maxProperties"',
      type: 'object',
      maxProperties: 2,
      required: ['property1', 'property2', 'property3'],
    },
  });

  testSchema({
    scenario: 'with a "false" literal schema',
    testBooleanLiteral: {
      schema: false,
      itThrowsTheError: 'Cannot generate data for a "false" literal schema',
    },
  });

  testSchema({
    scenario: 'with an array schema with a "false" literal items schema and non-zero "minItems"',
    schema: {
      itThrowsTheError: 'Cannot generate array items for "false" literal items schema and non-zero "minItems"',
      type: 'array',
      items: false,
      minItems: 1,
    },
  });

  testSchema({
    scenario: 'with an array schema with a "false" literal item tuple schema',
    schema: {
      itThrowsTheError: 'Cannot generate data for a "false" literal schema',
      type: 'array',
      items: [{}, false],
    },
  });
});
