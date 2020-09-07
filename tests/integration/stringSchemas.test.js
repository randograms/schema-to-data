describe('string schemas', function () {
  testSchema({
    scenario: 'by default',
    schema: {
      itAlwaysReturns: 'a string',
      type: 'string',
    },
    runCount: 100,
    itValidatesAgainst: [
      {
        itSometimesReturns: 'a shorter string',
        maxLength: 99,
      },
      {
        itSometimesReturns: 'a medium length string',
        minLength: 100,
        maxLength: 249,
      },
      {
        itSometimesReturns: 'a longer string',
        minLength: 250,
      },
    ],
  });

  testSchema({
    scenario: 'with minLength',
    schema: {
      itAlwaysReturns: 'a string with a length greater than or equal to minLength',
      type: 'string',
      minLength: 100,
    },
  });

  testSchema({
    scenario: 'with maxLength',
    schema: {
      itAlwaysReturns: 'a string with a length less than or equal to maxLength',
      type: 'string',
      maxLength: 10,
    },
  });

  testSchema({
    scenario: 'with minLength and maxLength',
    schema: {
      itAlwaysReturns: 'a string with a length between minLength and maxLength',
      type: 'string',
      minLength: 30,
      maxLength: 35,
    },
    runCount: 30,
    itValidatesAgainst: [
      {
        itSometimesReturns: 'a string with the minLength',
        minLength: 30,
        maxLength: 30,
      },
      {
        itSometimesReturns: 'a string with the maxLength',
        minLength: 35,
        maxLength: 35,
      },
      {
        itSometimesReturns: 'a string that is not the minLength or maxLength',
        minLength: 31,
        maxLength: 34,
      },
    ],
  });

  const supportedFormats = [
    ['date', 'a date'],
    ['date-time', 'a date-timestamp'],
    ['email', 'an email'],
    ['ipv4', 'an ipv4'],
    ['ipv6', 'an ipv6'],
    ['time', 'a timestamp'],
    ['uuid', 'a uuid'],
  ];

  supportedFormats.forEach(([format, description]) => testSchema({
    scenario: `with the ${format} format`,
    schema: {
      itAlwaysReturns: description,
      type: 'string',
      format,
    },
  }));
});
