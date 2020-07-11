describe('string schemas', function () {
  // TODO: test that default string length can vary
  testSchema({
    scenario: 'with just type',
    schema: { type: 'string' },
  });
});
