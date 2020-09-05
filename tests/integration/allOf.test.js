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

  testSchema({
    scenario: 'when the subschemas have different keywords',
    schema: {
      itAlwaysReturns: 'valid data',
      type: 'string',
      allOf: [
        {
          minLength: 3,
        },
        {
          maxLength: 5,
        },
      ],
    },
  });

  testSchema({
    scenario: 'when the base schema has a more limiting keyword than a subschema',
    schema: {
      itAlwaysReturns: 'valid data',
      type: 'string',
      maxLength: 3,
      allOf: [
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
      allOf: [
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
    scenario: 'when a subschema has an allOf',
    schema: {
      itAlwaysReturns: 'valid data',
      type: 'string',
      maxLength: 10,
      allOf: [
        {
          maxLength: 9,
          allOf: [
            {
              maxLength: 7,
            },
          ],
        },
        {
          maxLength: 8,
        },
      ],
    },
  });
});
