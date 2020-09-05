const _ = require('lodash');
const { defaultMocker } = require('../../../lib/mocker');

/**
 * Note: object schema keywords are used in this test because the library supports several of these keywords.
 * The merge rules for all of the keywords are thoroughly tested in another file
 */
describe('mergeCombinedSchemasForType/mergeCombinedSchemasForType', function () {
  context('when the schema has an allOf', function () {
    before(function () {
      this.singleTypedSchema = {
        type: 'object',
        minProperties: 1,
        maxProperties: 10,
        required: ['a'],
        allOf: [
          {
            minProperties: 2,
            required: ['b'],
          },
          {
            maxProperties: 9,
            required: ['c'],
          },
        ],
      };
      this.result = testUnit(defaultMocker, 'mergeCombinedSchemasForType', this.singleTypedSchema);
    });

    it('does not modify the original schema', function () {
      expect(this.result).to.not.equal(this.singleTypedSchema);
    });

    it('merges the combined schemas into the root schema', function () {
      expect(this.result).to.eql({
        type: 'object',
        minProperties: 2,
        maxProperties: 9,
        required: ['a', 'b', 'c'],
      });
    });
  });

  // TODO: consolidate this into a set of tests that verifies combinations of nested combined schemas work
  context('when the schema has an allOf with an allOf', function () {
    before(function () {
      this.singleTypedSchema = {
        type: 'object',
        minProperties: 1,
        maxProperties: 10,
        required: ['a'],
        allOf: [
          {
            minProperties: 2,
            required: ['b'],
          },
          {
            maxProperties: 9,
            required: ['c'],
            allOf: [
              {
                minProperties: 3,
                required: ['d'],
              },
              {
                maxProperties: 8,
                required: ['e'],
              },
            ],
          },
        ],
      };
      this.result = testUnit(defaultMocker, 'mergeCombinedSchemasForType', this.singleTypedSchema);
    });

    it('does not modify the original schema', function () {
      expect(this.result).to.not.equal(this.singleTypedSchema);
    });

    it('merges the combined schemas into the root schema', function () {
      expect(this.result).to.eql({
        type: 'object',
        minProperties: 3,
        maxProperties: 8,
        required: ['a', 'b', 'c', 'd', 'e'],
      });
    });
  });

  context('when the schema has an anyOf', function () {
    before(function () {
      this.singleTypedSchema = {
        type: 'object',
        anyOf: [
          {
            // type intentionally left out
            required: ['a'],
          },
          {
            type: 'object',
            required: ['b'],
          },
          {
            type: 'string',
            maxLength: 4,
          },
        ],
      };

      this.results = _.times(10, () => testUnit(defaultMocker, 'mergeCombinedSchemasForType', this.singleTypedSchema));
    });

    it('always merges at least one relevant subschema', function () {
      expect(this.results).to.all.satisfy((schema) => _.isArray(schema.required) && schema.required.length > 0);
    });

    it('sometimes merges a single subschema', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'object',
        required: ['a'],
      });
    });

    it('sometimes merges a different single subschema', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'object',
        required: ['b'],
      });
    });

    it('sometimes merges all relevant subschemas', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'object',
        required: ['a', 'b'],
      });
    });
  });

  // TODO: consolidate this into a set of tests that verifies combinations of nested combined schemas work
  context('when the schema has an anyOf with an anyOf', function () {
    before(function () {
      this.singleTypedSchema = {
        type: 'object',
        anyOf: [
          {
            type: 'object',
            required: ['a'],
          },
          {
            type: 'object',
            required: ['b'],
            anyOf: [
              {
                type: 'object',
                required: ['c'],
              },
              {
                type: 'object',
                required: ['d'],
              },
            ],
          },
        ],
      };

      this.results = _.times(50, () => testUnit(defaultMocker, 'mergeCombinedSchemasForType', this.singleTypedSchema));
    });

    const expectedVariations = [
      {
        type: 'object',
        required: ['a'],
      },
      {
        type: 'object',
        required: ['b', 'c'],
      },
      {
        type: 'object',
        required: ['b', 'd'],
      },
      {
        type: 'object',
        required: ['b', 'c', 'd'],
      },
      {
        type: 'object',
        required: ['a', 'b', 'c', 'd'],
      },
    ];

    it('always merges at least one relevant subschema', function () {
      expect(this.results).to.all.satisfy((schema) => _.isArray(schema.required) && schema.required.length > 0);
    });

    expectedVariations.forEach((expectedResult, index) => {
      it(`sometimes merges subschemas: ${expectedResult.required.join()}`, function () {
        expect(this.results, `case ${index} failed`).to.include.something.that.eqls(expectedResult);
      });
    });
  });

  context('when the schema has a "oneOf"', function () {
    before(function () {
      this.singleTypedSchema = {
        type: 'object',
        oneOf: [
          {
            type: 'object',
            required: ['a'],
          },
          {
            // type intentionally left out
            required: ['b'],
          },
          {
            type: 'string',
            maxLength: 4,
          },
        ],
      };

      this.results = _.times(10, () => testUnit(defaultMocker, 'mergeCombinedSchemasForType', this.singleTypedSchema));
    });

    it('always merges one compatible subschema', function () {
      expect(this.results).to.all.satisfy((mergedSchema) => (
        _.isArray(mergedSchema.required) && mergedSchema.required.length === 1
      ));
    });

    it('sometimes merges the first compatible subschema', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'object',
        required: ['a'],
      });
    });

    it('sometimes merges the second compatible subschema', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'object',
        required: ['b'],
      });
    });
  });
});
