describe('multi-typed schemas', function () {
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
