const { mapBasicSchemas } = require('./helpers/commonSchemas');

describe('list array items schemas', function () {
  testSchema({
    scenario: 'with typeless items',
    schema: {
      itAlwaysReturns: 'an array',
      type: 'array',
      items: {},
    },
    runCount: 30,
    itValidatesAgainst: mapBasicSchemas(({ schemaDescriptor, basicSchema }) => ({
      itSometimesReturns: `an array with ${schemaDescriptor}`,
      contains: basicSchema,
    })),
  });

  testSchema({
    scenario: 'with single typed items',
    schema: {
      itAlwaysReturns: 'an array with items of the provided type',
      type: 'array',
      items: { type: 'string' },
    },
  });

  testSchema({
    scenario: 'with multi-typed items',
    schema: {
      itAlwaysReturns: 'an array with items restricted by the provided types',
      type: 'array',
      items: { type: ['string', 'boolean'] },
    },
    itValidatesAgainst: [
      {
        itSometimesReturns: 'an array with an item of the first type',
        contains: { type: 'string' },
      },
      {
        itSometimesReturns: 'an array with an item of the second type',
        contains: { type: 'boolean' },
      },
    ],
  });
});
