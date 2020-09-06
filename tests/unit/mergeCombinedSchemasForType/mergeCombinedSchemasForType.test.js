const _ = require('lodash');
const { defaultMocker } = require('../../../lib/mocker');

/**
 * Note: object schema keywords are used in this test because the library supports several of these keywords.
 * The merge rules for all of the keywords are thoroughly tested in another file
 */
describe('mergeCombinedSchemasForType/mergeCombinedSchemasForType', function () {
  context('when the schema has an "allOf"', function () {
    before(function () {
      this.singleTypedSchema = {
        type: 'object',
        minProperties: 1,
        maxProperties: 10,
        required: ['a'],
        allOf: [
          {
            type: 'object',
            minProperties: 2,
            required: ['b'],
            allOf: null,
            anyOf: null,
            oneOf: null,
          },
          {
            type: 'object',
            maxProperties: 9,
            required: ['c'],
            allOf: null,
            anyOf: null,
            oneOf: null,
          },
        ],
        anyOf: null,
        oneOf: null,
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

  context('when the schema has an "anyOf"', function () {
    before(function () {
      this.singleTypedSchema = {
        type: 'object',
        allOf: null,
        anyOf: [
          {
            type: 'object',
            required: ['a'],
            allOf: null,
            anyOf: null,
            oneOf: null,
          },
          {
            type: 'object',
            required: ['b'],
            allOf: null,
            anyOf: null,
            oneOf: null,
          },
        ],
        oneOf: null,
      };

      this.results = _.times(30, () => testUnit(defaultMocker, 'mergeCombinedSchemasForType', this.singleTypedSchema));
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

  context('when the schema has a "oneOf"', function () {
    before(function () {
      this.singleTypedSchema = {
        type: 'object',
        allOf: null,
        anyOf: null,
        oneOf: [
          {
            type: 'object',
            required: ['a'],
            allOf: null,
            anyOf: null,
            oneOf: null,
          },
          {
            type: 'object',
            required: ['b'],
            allOf: null,
            anyOf: null,
            oneOf: null,
          },
        ],
      };

      this.results = _.times(20, () => testUnit(defaultMocker, 'mergeCombinedSchemasForType', this.singleTypedSchema));
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

  context('when the schema has an "allOf", "anyOf" and "oneOf"', function () {
    before(function () {
      const singleTypedSchema = {
        type: 'object',
        required: ['a'],
        allOf: [{
          type: 'object',
          required: ['b'],
          allOf: null,
          anyOf: null,
          oneOf: null,
        }],
        anyOf: [{
          type: 'object',
          required: ['c'],
          allOf: null,
          anyOf: null,
          oneOf: null,
        }],
        oneOf: [{
          type: 'object',
          required: ['d'],
          allOf: null,
          anyOf: null,
          oneOf: null,
        }],
      };

      this.result = testUnit(defaultMocker, 'mergeCombinedSchemasForType', singleTypedSchema);
    });

    it('merges all nested combined schemas', function () {
      expect(this.result).to.eql({
        type: 'object',
        required: ['a', 'b', 'c', 'd'],
      });
    });
  });

  context('when the schema has multiple nested combined schemas', function () {
    before(function () {
      const singleTypedSchema = {
        type: 'object',
        required: ['a'],
        allOf: [{
          type: 'object',
          required: ['b'],
          allOf: [{
            type: 'object',
            required: ['c'],
            allOf: null,
            anyOf: null,
            oneOf: null,
          }],
          anyOf: [{
            type: 'object',
            required: ['d'],
            allOf: null,
            anyOf: null,
            oneOf: null,
          }],
          oneOf: [{
            type: 'object',
            required: ['e'],
            allOf: null,
            anyOf: null,
            oneOf: null,
          }],
        }],
        anyOf: [{
          type: 'object',
          required: ['f'],
          allOf: [{
            type: 'object',
            required: ['g'],
            allOf: null,
            anyOf: null,
            oneOf: null,
          }],
          anyOf: [{
            type: 'object',
            required: ['h'],
            allOf: null,
            anyOf: null,
            oneOf: null,
          }],
          oneOf: [{
            type: 'object',
            required: ['i'],
            allOf: null,
            anyOf: null,
            oneOf: null,
          }],
        }],
        oneOf: [{
          type: 'object',
          required: ['j'],
          allOf: [{
            type: 'object',
            required: ['k'],
            allOf: null,
            anyOf: null,
            oneOf: null,
          }],
          anyOf: [{
            type: 'object',
            required: ['l'],
            allOf: null,
            anyOf: null,
            oneOf: null,
          }],
          oneOf: [{
            type: 'object',
            required: ['m'],
            allOf: null,
            anyOf: null,
            oneOf: null,
          }],
        }],
      };

      this.result = testUnit(defaultMocker, 'mergeCombinedSchemasForType', singleTypedSchema);
    });

    it('merges all nested combined schemas', function () {
      expect(this.result).to.eql({
        type: 'object',
        required: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'],
      });
    });
  });
});
