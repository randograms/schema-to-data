describe('null schemas', function () {
  testSchema({
    scenario: 'by default',
    schema: {
      itAlwaysReturns: 'null',
      type: 'null',
    },
  });
});
