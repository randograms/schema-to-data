const _ = require('lodash');
const { defaultMocker } = require('../../../lib/mocker');

describe('mergeCombinedSchemas/mergeKeywordsIntoSchema', function () {
  const numberConfig = [
    {
      keyword: 'maximum',
      schemaAValue: 1,
      schemaBValue: 2,
      bothHaveKeyword: {
        statement: 'uses the minimum of the two values',
        expectedValue: 1,
      },
    },
    {
      keyword: 'minimum',
      schemaAValue: 1,
      schemaBValue: 2,
      bothHaveKeyword: {
        statement: 'uses the maximum of the two values',
        expectedValue: 2,
      },
    },
  ];

  const allTypesConfig = {
    array: [
      {
        keyword: 'additionalItems',
        schemaAValue: { referenceId: 'subschema1' },
        schemaBValue: { referenceId: 'subschema2' },
        keywordValueIsSchema: true,
        bothHaveKeyword: {
          statement: 'combines the subschemas into a single additionalItems definition',
          expectedValue: { allOf: [{ referenceId: 'subschema1' }, { referenceId: 'subschema2' }] },
        },
      },
      {
        keyword: 'items',
        clarification: '(list)',
        schemaAValue: { referenceId: 'subschema1' },
        schemaBValue: { referenceId: 'subschema2' },
        keywordValueIsSchema: true,
        bothHaveKeyword: {
          statement: 'combines the subschemas into a single items definition',
          expectedValue: { allOf: [{ referenceId: 'subschema1' }, { referenceId: 'subschema2' }] },
        },
      },
      {
        keyword: 'items',
        clarification: '(tuple)',
        schemaAValue: [
          { referenceId: 'subschema1a' },
          { referenceId: 'subschema1b' },
          { referenceId: 'subschema1c' }],
        schemaBValue: [
          { referenceId: 'subschema2a' },
          true,
          false,
          { referenceId: 'subschema2d' },
        ],
        bothHaveKeyword: {
          statement: 'combines the corresponding subschemas into a new tuple definition',
          expectedValue: [
            {
              allOf: [
                { referenceId: 'subschema2a' },
                { referenceId: 'subschema1a' },
              ],
            },
            { referenceId: 'subschema1b' },
            false, // yes this schema doesn't make sense, but at least the rules are consistent
            { referenceId: 'subschema2d' },
          ],
        },
      },
      {
        keyword: 'items',
        clarification: '(list and tuple)',
        schemaAValue: { referenceId: 'subschema1' },
        schemaBValue: [{ referenceId: 'subschema2' }, { referenceId: 'subschema3' }],
        keywordValueIsSchema: true,
        bothHaveKeyword: {
          statement: 'merges the list subschema into each tuple subschema',
          expectedValue: [
            {
              allOf: [
                { referenceId: 'subschema1' },
                { referenceId: 'subschema2' },
              ],
            },
            {
              allOf: [
                { referenceId: 'subschema1' },
                { referenceId: 'subschema3' },
              ],
            },
          ],
        },
      },
    ],
    decimal: numberConfig,
    integer: numberConfig,
    object: [
      {
        keyword: 'maxProperties',
        schemaAValue: 1,
        schemaBValue: 2,
        bothHaveKeyword: {
          statement: 'uses the minimum of the two values',
          expectedValue: 1,
        },
      },
      {
        keyword: 'minProperties',
        schemaAValue: 1,
        schemaBValue: 2,
        bothHaveKeyword: {
          statement: 'uses the maximum of the two values',
          expectedValue: 2,
        },
      },
      {
        keyword: 'properties',
        schemaAValue: {
          property1: { referenceId: 'subschema1a' },
          property2: { referenceId: 'subschema2a' },
          property3: { referenceId: 'subschema3a' },
        },
        schemaBValue: {
          property1: { referenceId: 'subschema1b' },
          property2: true,
          property3: false,
          property4: { referenceId: 'subschema4b' },
        },
        bothHaveKeyword: {
          statement: 'combines the corresponding subschemas',
          expectedValue: {
            property1: {
              allOf: [
                { referenceId: 'subschema1a' },
                { referenceId: 'subschema1b' },
              ],
            },
            property2: { referenceId: 'subschema2a' },
            property3: false,
            property4: { referenceId: 'subschema4b' },
          },
        },
      },
      {
        keyword: 'required',
        schemaAValue: ['a', 'b'],
        schemaBValue: ['b', 'c', 'd'],
        bothHaveKeyword: {
          statement: 'uses the union of the two values',
          expectedValue: ['a', 'b', 'c', 'd'],
        },
      },
    ],
    string: [
      {
        keyword: 'format',
        schemaAValue: 'uuid',
        schemaBValue: 'ipv4',
        bothHaveKeyword: {
          statement: 'uses the value from schemaB',
          expectedValue: 'ipv4',
        },
      },
      {
        keyword: 'maxLength',
        schemaAValue: 1,
        schemaBValue: 2,
        bothHaveKeyword: {
          statement: 'uses the minimum of the two values',
          expectedValue: 1,
        },
      },
      {
        keyword: 'minLength',
        schemaAValue: 1,
        schemaBValue: 2,
        bothHaveKeyword: {
          statement: 'uses the maximum of the two values',
          expectedValue: 2,
        },
      },
      {
        keyword: 'pattern',
        schemaAValue: 'abc',
        schemaBValue: '123',
        bothHaveKeyword: {
          statement: 'uses the value from schemaB',
          expectedValue: '123',
        },
      },
    ],
  };

  const allKeywordConfig = _.toPairs(allTypesConfig).flatMap(([type, configs]) => configs.map((keywordConfig) => ({
    type,
    ...keywordConfig,
  })));

  allKeywordConfig.forEach(({
    type,
    keyword,
    clarification = '',
    schemaAValue,
    schemaBValue,
    keywordValueIsSchema = false,
    bothHaveKeyword: {
      statement,
      expectedValue,
    },
  }) => {
    describe(`${type}: ${keyword}${clarification}`, function () {
      context('when neither schema has the keyword', function () {
        it('does not append the keyword to schemaA', function () {
          const schemaA = {};
          const schemaB = {};
          defaultMocker.mergeKeywordsIntoSchema(schemaA, schemaB, type);

          expect(schemaA).to.eql({});
        });
      });

      context('when only schemaA has the keyword', function () {
        it('does not modify schemaA', function () {
          const schemaA = { [keyword]: schemaAValue };
          const schemaB = {};
          defaultMocker.mergeKeywordsIntoSchema(schemaA, schemaB, type);

          expect(schemaA).to.eql({ [keyword]: schemaAValue });
        });
      });

      context('when only schemaB has the keyword', function () {
        it('modifies schemaA to have the keyword from schemaB', function () {
          const schemaA = {};
          const schemaB = { [keyword]: schemaBValue };
          defaultMocker.mergeKeywordsIntoSchema(schemaA, schemaB, type);

          expect(schemaA).to.eql({ [keyword]: schemaBValue });
        });
      });

      context('when both schemas have the keyword', function () {
        it(statement, function () {
          const schemaA = { [keyword]: schemaAValue };
          const schemaB = { [keyword]: schemaBValue };
          defaultMocker.mergeKeywordsIntoSchema(schemaA, schemaB, type);

          expect(schemaA).to.eql({ [keyword]: expectedValue });
        });
      });

      if (keywordValueIsSchema) {
        context('when schemaAs value is "true"', function () {
          it('modifies schemaA to have the keyword from schemaB', function () {
            const schemaA = { [keyword]: true };
            const schemaB = { [keyword]: schemaBValue };
            defaultMocker.mergeKeywordsIntoSchema(schemaA, schemaB, type);

            expect(schemaA).to.eql({ [keyword]: schemaBValue });
          });
        });

        context('when schemaBs value is "true"', function () {
          it('does not modify schemaA', function () {
            const schemaA = { [keyword]: schemaAValue };
            const schemaB = { [keyword]: true };
            defaultMocker.mergeKeywordsIntoSchema(schemaA, schemaB, type);

            expect(schemaA).to.eql({ [keyword]: schemaAValue });
          });
        });

        context('when schemaAs value is "false"', function () {
          it('sets the value to false', function () {
            const schemaA = { [keyword]: false };
            const schemaB = { [keyword]: schemaBValue };
            defaultMocker.mergeKeywordsIntoSchema(schemaA, schemaB, type);

            expect(schemaA).to.eql({ [keyword]: false });
          });
        });

        context('when schemaBs value is "false"', function () {
          it('sets the value to false', function () {
            const schemaA = { [keyword]: schemaAValue };
            const schemaB = { [keyword]: false };
            defaultMocker.mergeKeywordsIntoSchema(schemaA, schemaB, type);

            expect(schemaA).to.eql({ [keyword]: false });
          });
        });
      }
    });
  });
});
