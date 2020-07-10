describe('boolean schemas', function () {
  testSchema({
    scenario: 'with just type',
    schema: { type: 'boolean' },
    itSometimesValidatesAgainst: [
      {
        itSometimesReturns: 'true',
        const: true,
      },
      {
        itSometimesReturns: 'false',
        const: false,
      },
    ],
  });
});
