const { mapBasicSchemas } = require('./helpers/commonSchemas');

describe('multi-typed schemas', function () {
  testSchema({
    scenario: 'without a schema',
    testNonObjectArgument: {
      schema: undefined,
      itAlwaysReturns: 'data',
    },
    alternateBaseValidationSchema: true,
    runCount: 30,
    itValidatesAgainst: mapBasicSchemas(({ schemaDescriptor, basicSchema }) => ({
      itSometimesReturns: `${schemaDescriptor}`,
      ...basicSchema,
    })),
  });

  testSchema({
    scenario: 'when type is undefined',
    schema: {
      itAlwaysReturns: 'data',
    },
    runCount: 30,
    itValidatesAgainst: mapBasicSchemas(({ schemaDescriptor, basicSchema }) => ({
      itSometimesReturns: `${schemaDescriptor}`,
      ...basicSchema,
    })),
  });

  testSchema({
    scenario: 'with a "true" literal schema',
    testNonObjectArgument: {
      schema: true,
      itAlwaysReturns: 'data',
    },
    runCount: 30,
    itValidatesAgainst: mapBasicSchemas(({ schemaDescriptor, basicSchema }) => ({
      itSometimesReturns: `${schemaDescriptor}`,
      ...basicSchema,
    })),
  });

  testSchema({
    scenario: 'with one type in an array',
    schema: {
      itAlwaysReturns: 'data of the provided type',
      type: ['string'],
    },
  });

  testSchema({
    scenario: 'with multiple types',
    schema: {
      itAlwaysReturns: 'data of one of the provided types',
      type: ['string', 'boolean'],
    },
    itValidatesAgainst: [
      {
        itSometimesReturns: 'data of the first type',
        contains: { type: 'string' },
      },
      {
        itSometimesReturns: 'data of the second type',
        contains: { type: 'boolean' },
      },
    ],
  });
});
