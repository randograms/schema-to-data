describe('boolean schemas', function () {
  testSchema({
    scenario: 'by default',
    schema: {
      itAlwaysReturns: 'a boolean',
      type: 'boolean',
    },
    itValidatesAgainst: [
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
