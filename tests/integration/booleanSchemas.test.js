describe('boolean schemas', function () {
  testSchema({
    scenario: 'by default',
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
