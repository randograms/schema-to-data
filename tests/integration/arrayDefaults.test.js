describe('array defaults', function () {
  testSchema({
    scenario: 'with a list array, "minArrayItems" and "arrayItemsRange"',
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
        itAlwaysReturns: 'an array with length in the range ("minArrayItems", "minArrayItems" + "arrayItemsRange")',
        minItems: 5,
        maxItems: 9,
      },
      {
        itSometimesReturns: 'an array with "minArrayItems" items',
        maxItems: 5,
      },
      {
        itSometimesReturns: 'an array with length in the range ["minArrayItems", "minArrayItems" + "arrayItemsRange"]',
        minItems: 6,
        maxItems: 8,
      },
      {
        itSometimesReturns: 'an array with length ("minArrayItems" + "arrayItemsRange")',
        minItems: 9,
      },
    ],
  });
});
