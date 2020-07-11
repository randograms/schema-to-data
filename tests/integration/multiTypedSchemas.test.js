const { mapBasicSchemas } = require('./helpers/commonSchemas');

describe('multi-typed schemas', function () {
  testSchema({
    scenario: 'when type is undefined',
    schema: {},
    runCount: 30,
    itSometimesValidatesAgainst: mapBasicSchemas(({ descriptor, basicSchema }) => ({
      itSometimesReturns: `${descriptor}`,
      ...basicSchema,
    })),
  });

  testSchema({
    scenario: 'with one type in an array',
    schema: { type: ['string'] },
  });

  testSchema({
    scenario: 'with multiple types',
    schema: { type: ['string', 'boolean'] },
    itSometimesValidatesAgainst: [
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
