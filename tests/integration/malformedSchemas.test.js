const { mapBasicSchemas } = require('./helpers/commonSchemas');

describe('malformed schemas', function () {
  testSchema({
    scenario: 'when type is an empty array',
    schema: {
      itThrowsTheError: 'Expected schema to have a known type but got "undefined"',
      type: [],
    },
    theSchemaIsInvalidBecause: 'data.type should be equal to one of the allowed values',
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
});
