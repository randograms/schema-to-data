const { mapBasicSchemas } = require('./helpers/commonSchemas');

describe('object properties schemas', function () {
  testSchema({
    scenario: 'with typeless additional properties',
    schema: {
      itAlwaysReturns: 'an object',
      type: 'object',
      // needs to force exactly 1 property since each additional property could have its own type
      minProperties: 1,
      maxProperties: 1,
    },
    runCount: 30,
    itValidatesAgainst: mapBasicSchemas(({ schemaDescriptor, basicSchema }) => ({
      itSometimesReturns: `an object with ${schemaDescriptor} additional property`,
      additionalProperties: basicSchema,
    })),
  });

  testSchema({
    scenario: 'with typeless optional properties',
    schema: {
      itAlwaysReturns: 'an object',
      type: 'object',
      properties: {
        property1: {},
      },
    },
    runCount: 30,
    itValidatesAgainst: mapBasicSchemas(({ schemaDescriptor, basicSchema }) => ({
      itSometimesReturns: `an object with ${schemaDescriptor} property`,
      properties: { property1: basicSchema },
      required: ['property1'],
    })),
  });

  testSchema({
    scenario: 'with multi-typed properties',
    schema: {
      itAlwaysReturns: 'an object',
      type: 'object',
      properties: {
        property1: { type: ['number', 'boolean'] },
      },
    },
    itValidatesAgainst: [
      {
        itSometimesReturns: 'an object with a property that has the first type',
        properties: { property1: { type: 'number' } },
        required: ['property1'],
      },
      {
        itSometimesReturns: 'an object with a property that has the second type',
        properties: { property1: { type: 'boolean' } },
        required: ['property1'],
      },
    ],
  });

  testSchema({
    scenario: 'with typeless required properties',
    schema: {
      itAlwaysReturns: 'an object with the required properties',
      type: 'object',
      required: ['property1'],
    },
    runCount: 50,
    itValidatesAgainst: mapBasicSchemas(({ schemaDescriptor, basicSchema }) => ({
      itSometimesReturns: `an object with ${schemaDescriptor} property`,
      properties: { property: basicSchema },
      required: ['property1'],
    })),
  });
});
