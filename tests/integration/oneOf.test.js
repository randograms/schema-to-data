describe('oneOf', function () {
  testSchema({
    scenario: 'with "type"',
    schema: {
      itAlwaysReturns: 'data of a supported type',
      oneOf: [
        { type: 'string' },
        { type: 'boolean' },
        { type: 'integer' },
      ],
    },
    itValidatesAgainst: [
      {
        itSometimesReturns: 'data of the first supported type',
        type: 'string',
      },
      {
        itSometimesReturns: 'data of the second supported type',
        type: 'boolean',
      },
      {
        itSometimesReturns: 'data of the third supported type',
        type: 'integer',
      },
    ],
  });

  testSchema({
    scenario: 'when the subschemas have different keywords',
    schema: {
      itAlwaysReturns: 'valid data',
      type: 'string',
      oneOf: [
        {
          minLength: 7,
        },
        {
          maxLength: 5,
        },
      ],
    },
    itValidatesAgainst: [
      {
        itSometimesReturns: 'data that ignores the first subschema',
        maxLength: 6,
      },
      {
        itSometimesReturns: 'data that ignores the second subschema',
        minLength: 6,
      },
    ],
  });

  testSchema({
    scenario: 'when the base schema has a more limiting keyword than a subschema',
    schema: {
      itAlwaysReturns: 'valid data',
      type: 'string',
      maxLength: 3,
      oneOf: [
        {
          maxLength: 4,
        },
      ],
    },
  });

  testSchema({
    scenario: 'when a subschema has a more limiting keyword than the base schema',
    schema: {
      itAlwaysReturns: 'valid data',
      type: 'string',
      maxLength: 5,
      oneOf: [
        {
          maxLength: 3,
        },
      ],
    },
  });
});
