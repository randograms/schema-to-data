describe('integer schemas', function () {
  testSchema({
    scenario: 'by default',
    schema: {
      itAlwaysReturns: 'an integer',
      type: 'integer',
    },
  });
});
