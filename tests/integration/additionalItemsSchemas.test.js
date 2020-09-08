const { mapBasicSchemas } = require('./helpers/commonSchemas');

describe('additionalItems schemas', function () {
  testSchema({
    scenario: 'with a list array definition',
    schema: {
      itAlwaysReturns: 'an array that ignores the additionalItems schema',
      type: 'array',
      items: { type: 'string' },
      minItems: 3,
      additionalItems: { type: 'boolean' },
    },
  });

  testSchema({
    scenario: 'with a list array definition and "false" literal additional items',
    schema: {
      itAlwaysReturns: 'an array that ignores the additionalItems schema',
      type: 'array',
      items: { type: 'string' },
      minItems: 3,
      additionalItems: false,
    },
  });

  testSchema({
    scenario: 'with typeless additionalItems (object literal schema)',
    schema: {
      itAlwaysReturns: 'an array',
      type: 'array',
      items: [{ type: 'string' }, { type: 'string' }],
      minItems: 3,
      additionalItems: {},
    },
    runCount: 30,
    itValidatesAgainst: mapBasicSchemas(({ schemaDescriptor, basicSchema }) => ({
      itSometimesReturns: `an array with ${schemaDescriptor} additional item`,
      items: [{ type: 'string' }, { type: 'string' }, basicSchema],
    })),
  });

  testSchema({
    scenario: 'with typeless additionalItems (boolean literal schema)',
    schema: {
      itAlwaysReturns: 'an array',
      type: 'array',
      items: [{ type: 'string' }, { type: 'string' }],
      minItems: 3,
      additionalItems: true,
    },
    runCount: 30,
    itValidatesAgainst: mapBasicSchemas(({ schemaDescriptor, basicSchema }) => ({
      itSometimesReturns: `an array with ${schemaDescriptor} additional item`,
      items: [{ type: 'string' }, { type: 'string' }, basicSchema],
    })),
  });

  testSchema({
    scenario: 'with single typed additionalItems',
    schema: {
      itAlwaysReturns: 'an array with additional items of the provided type',
      type: 'array',
      items: [{ type: 'string' }, { type: 'string' }],
      minItems: 3,
      additionalItems: { type: 'boolean' },
    },
  });

  testSchema({
    scenario: 'with multi-typed additionalItems',
    schema: {
      itAlwaysReturns: 'an array with additional items restricted by the provided types',
      type: 'array',
      items: [{ type: 'string' }, { type: 'string' }],
      minItems: 3,
      additionalItems: { type: ['integer', 'boolean'] },
    },
    itValidatesAgainst: [
      {
        itSometimesReturns: 'an array with an additional item of the first additional type',
        contains: { type: 'integer' },
      },
      {
        itSometimesReturns: 'an array with an additional item of the second type',
        contains: { type: 'boolean' },
      },
    ],
  });

  testSchema({
    scenario: 'with a "false" literal additionalItems schema',
    schema: {
      itAlwaysReturns: 'a valid array',
      type: 'array',
      items: [true, true],
      minItems: 2,
      additionalItems: false,
    },
  });
});
