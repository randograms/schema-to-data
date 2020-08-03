describe('array defaults', function () {
  testSchema({
    scenario: 'with a list array, "minArrayItems" and "arrayLengthRange"',
    customDefaults: {
      minArrayItems: 5,
      arrayLengthRange: 4,
    },
    schema: {
      itAlwaysReturns: 'an array',
      type: 'array',
      items: true,
    },
    itValidatesAgainst: [
      {
        itAlwaysReturns: 'an array with length in the range ("minArrayItems", "minArrayItems" + "arrayLengthRange")',
        minItems: 5,
        maxItems: 9,
      },
      {
        itSometimesReturns: 'an array with "minArrayItems" items',
        maxItems: 5,
      },
      {
        itSometimesReturns: 'an array with length in the range ["minArrayItems", "minArrayItems" + "arrayLengthRange"]',
        minItems: 6,
        maxItems: 8,
      },
      {
        itSometimesReturns: 'an array with length ("minArrayItems" + "arrayLengthRange")',
        minItems: 9,
      },
    ],
  });
});
