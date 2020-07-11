describe('string schemas', function () {
  // TODO: test that default string length can vary
  testSchema({
    scenario: 'by default',
    schema: {
      itAlwaysReturns: 'a string',
      type: 'string',
    },
  });
});
