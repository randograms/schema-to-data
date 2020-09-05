describe('allOf', function () {
  testSchema({
    scenario: 'with "type"',
    schema: {
      itAlwaysReturns: 'data of a supported type',
      allOf: [
        { type: ['string', 'boolean', 'number'] },
        { type: ['array', 'object', 'string', 'boolean'] },
        { type: ['null', 'boolean', 'string'] },
      ],
    },
    itValidatesAgainst: [
      {
        itSometimesReturns: 'data of one supported type',
        type: 'string',
      },
      {
        itSometimesReturns: 'data of a different supported type',
        type: 'boolean',
      },
    ],
  });

});
