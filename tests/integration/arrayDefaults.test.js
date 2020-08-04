describe('array defaults', function () {
  testSchema({
    scenario: 'with a list array schema, "minArrayItems" and "arrayItemsRange"',
    customDefaults: {
      minArrayItems: 5,
      arrayItemsRange: 4,
    },
    schema: {
      itAlwaysReturns: 'an array',
      type: 'array',
      items: true,
    },
    itValidatesAgainst: [
      {
        itAlwaysReturns: 'an array with length in the range ["minArrayItems", "minArrayItems" + "arrayItemsRange"]',
        minItems: 5,
        maxItems: 9,
      },
      {
        itSometimesReturns: 'an array with "minArrayItems" items',
        maxItems: 5,
      },
      {
        itSometimesReturns: 'an array with length in the range ("minArrayItems", "minArrayItems" + "arrayItemsRange")',
        minItems: 6,
        maxItems: 8,
      },
      {
        itSometimesReturns: 'an array with length ("minArrayItems" + "arrayItemsRange")',
        minItems: 9,
      },
    ],
  });

  testSchema({
    scenario: 'with a tuple array schema, "minArrayItems" and "maxExtraAdditionalItems"',
    customDefaults: {
      minArrayItems: 1,
      maxExtraAdditionalItems: 4,
    },
    schema: {
      itAlwaysReturns: 'an array',
      type: 'array',
      items: [true, true],
    },
    itValidatesAgainst: [
      {
        itAlwaysReturns: 'an array with length in the range ["minArrayItems", "minArrayItems" + "maxExtraAdditionalItems"]', // eslint-disable-line max-len
        minItems: 1,
        maxItems: 6,
      },
      {
        itSometimesReturns: 'an array with "minArrayItems" items',
        maxItems: 1,
      },
      {
        itSometimesReturns: 'an array with length in the range ("minArrayItems", "minArrayItems" + "maxExtraAdditionalItems")', // eslint-disable-line max-len
        minItems: 2,
        maxItems: 5,
      },
      {
        itSometimesReturns: 'an array with length ("minArrayItems" + "maxExtraAdditionalItems")',
        minItems: 6,
      },
    ],
  });
});
