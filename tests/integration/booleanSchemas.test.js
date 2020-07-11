describe('boolean schemas', function () {
  testSchema({
    scenario: 'by default',
    schema: {
      itAlwaysReturns: 'a boolean',
      type: 'boolean',
    },
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
