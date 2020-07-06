describe('multi-typed schemas', function () {
  testSchema({
    description: 'with one type in an array',
    schema: { type: ['string'] },
  });

  testSchema({
    description: 'with multiple types',
    schema: { type: ['string', 'boolean'] },
  });
});
