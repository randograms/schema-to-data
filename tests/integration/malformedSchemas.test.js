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
});
