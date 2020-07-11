const { mapBasicSchemas } = require('./helpers/commonSchemas');

describe('object properties schemas', function () {
  testSchema({
    scenario: 'with multi-typed properties',
    schema: {
      itAlwaysReturns: 'an object',
      type: 'object',
      properties: {
        property: { type: ['number', 'boolean'] },
      },
    },
    itSometimesValidatesAgainst: [
      {
        itSometimesReturns: 'an object with a property that has the first type',
        properties: { property: { type: 'number' } },
        required: ['property'],
      },
      {
        itSometimesReturns: 'an object with a property that has the second type',
        properties: { property: { type: 'boolean' } },
        required: ['property'],
      },
    ],
  });

  testSchema({
    scenario: 'with typeless required properties',
    schema: {
      itAlwaysReturns: 'an object with the required properties',
      type: 'object',
      required: ['property'],
    },
    runCount: 40,
    itSometimesValidatesAgainst: mapBasicSchemas(({ schemaDescriptor, basicSchema }) => ({
      itSometimesReturns: `an object with ${schemaDescriptor} property`,
      properties: { property: basicSchema },
      required: ['property'],
    })),
  });
});
