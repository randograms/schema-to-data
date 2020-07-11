describe('string schemas', function () {
  // TODO: test that default string length can vary
  testSchema({
    scenario: 'by default',
    schema: { type: 'string' },
  });
});
