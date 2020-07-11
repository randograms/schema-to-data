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
    runCount: 30,
    theSchemaIsInvalidBecause: 'data.type should be equal to one of the allowed values',
    itSometimesValidatesAgainst: mapBasicSchemas(({ descriptor, basicSchema }) => ({
      itSometimesReturns: `${descriptor}`,
      ...basicSchema,
    })),
  });
});
