const { mapBasicSchemas } = require('./helpers/commonSchemas');

describe('array schemas', function () {
  testSchema({
    scenario: 'with just type',
    schema: { type: 'array' },
    runCount: 30,
    itSometimesValidatesAgainst: [
      {
        itSometimesReturns: 'an empty array',
        maxItems: 0,
      },
      ...mapBasicSchemas(({ descriptor, basicSchema }) => ({
        itSometimesReturns: `an array with ${descriptor}`,
        contains: basicSchema,
      })),
    ],
  });

  // TODO: test that the generated array does not have to have every item
  testSchema({
    scenario: 'when items is a tuple',
    schema: {
      type: 'array',
      items: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }],
    },
  });

  testSchema({
    scenario: 'with typeless items',
    schema: {
      type: 'array',
      items: {},
    },
    runCount: 30,
    itSometimesValidatesAgainst: mapBasicSchemas(({ descriptor, basicSchema }) => ({
      itSometimesReturns: `an array with ${descriptor}`,
      contains: basicSchema,
    })),
  });

  testSchema({
    scenario: 'with single typed items',
    schema: {
      type: 'array',
      items: { type: 'string' },
    },
  });

  testSchema({
    scenario: 'with multi-typed items',
    schema: {
      type: 'array',
      items: { type: ['string', 'boolean'] },
    },
    itSometimesValidatesAgainst: [
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
