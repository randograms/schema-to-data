describe('anyOf', function () {
  testSchema({
    scenario: 'with "type"',
    schema: {
      itAlwaysReturns: 'data of a supported type',
      anyOf: [
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
      anyOf: [
        {
          minLength: 3,
        },
        {
          maxLength: 5,
        },
      ],
    },
    itValidatesAgainst: [
      {
        itSometimesReturns: 'data that ignores the first subschema',
        maxLength: 2,
      },
      {
        itSometimesReturns: 'data that ignores the second subschema',
        minLength: 6,
      },
      {
        itSometimesReturns: 'data that adheres to both subschemas',
        minLength: 3,
        maxLength: 5,
      },
    ],
  });

  testSchema({
    scenario: 'when the base schema has a more limiting keyword than a subschema',
    schema: {
      itAlwaysReturns: 'valid data',
      type: 'string',
      maxLength: 3,
      anyOf: [
        {
          maxLength: 4,
        },
        {
          maxLength: 5,
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
      anyOf: [
        {
          maxLength: 3,
        },
        {
          maxLength: 4,
        },
      ],
    },
  });

  testSchema({
    scenario: 'when a subschema has an anyOf',
    schema: {
      itAlwaysReturns: 'valid data',
      type: 'string',
      maxLength: 10,
      anyOf: [
        {
          maxLength: 9,
          anyOf: [
            {
              maxLength: 7,
            },
          ],
        },
      ],
    },
  });
});
