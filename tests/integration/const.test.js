describe('const', function () {
  testSchema({
    scenario: 'with an array const',
    schema: {
      itAlwaysReturns: 'the const value',
      const: [1, 2, 3],
    },
  });

  testSchema({
    scenario: 'with a boolean const',
    schema: {
      itAlwaysReturns: 'the const value',
      const: true,
    },
  });

  testSchema({
    scenario: 'with an integer const',
    schema: {
      itAlwaysReturns: 'the const value',
      const: 2,
    },
  });

  testSchema({
    scenario: 'with a decimal const',
    schema: {
      itAlwaysReturns: 'the const value',
      const: 1.1,
    },
  });

  testSchema({
    scenario: 'with a null const',
    schema: {
      itAlwaysReturns: 'the const value',
      const: null,
    },
  });

  testSchema({
    scenario: 'with an object const',
    schema: {
      itAlwaysReturns: 'the const value',
      const: { value: 'a' },
    },
  });

  testSchema({
    scenario: 'with a string const',
    schema: {
      itAlwaysReturns: 'the const value',
      const: 'abc',
    },
  });
});
