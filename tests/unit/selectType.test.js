const _ = require('lodash');
const { defaultMocker } = require('../../lib/mocker');

describe('selectType', function () {
  const additionalSchemaKeys = Symbol('additionalSchemaKeys');

  context('with a typedSchema with a single type', function () {
    before(function () {
      this.typedSchema = {
        type: ['integer'],
        allOf: null,
        anyOf: null,
        oneOf: null,
        additionalSchemaKeys,
      };

      this.result = testUnit(defaultMocker, 'selectType', this.typedSchema);
    });

    it('returns a schema with a single string type and all additional keys', function () {
      expect(this.result).to.eql({
        type: 'integer',
        allOf: null,
        anyOf: null,
        oneOf: null,
        additionalSchemaKeys,
      });
    });
  });

  context('with a typedSchema with multiple types', function () {
    this.retries(20);

    const allExpectedAdditionalKeys = {
      allOf: null,
      anyOf: null,
      oneOf: null,
      additionalSchemaKeys,
    };

    beforeEach(function () {
      this.typedSchema = {
        type: [
          'null',
          'string',
          'decimal',
          'integer',
          'boolean',
          'array',
          'object',
        ],
        allOf: null,
        anyOf: null,
        oneOf: null,
        additionalSchemaKeys,
      };

      this.results = _.times(10, () => testUnit(defaultMocker, 'selectType', this.typedSchema));
    });

    it('always returns a schema with a single type', function () {
      expect(this.results).to.all.satisfy((singleTypedSchema) => _.isString(singleTypedSchema.type));
    });

    it('always returns a schema with the additional keys', function () {
      expect(this.results).to.all.satisfy((singleTypedSchema) => (
        singleTypedSchema.additionalSchemaKeys === additionalSchemaKeys
      ));
    });

    it('can return a null schema', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'null',
        ...allExpectedAdditionalKeys,
      });
    });

    it('can return a string schema', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'string',
        ...allExpectedAdditionalKeys,
      });
    });

    it('can return a decimal schema', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'decimal',
        ...allExpectedAdditionalKeys,
      });
    });

    it('can return an integer schema', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'integer',
        ...allExpectedAdditionalKeys,
      });
    });

    it('can return a boolean schema', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'boolean',
        ...allExpectedAdditionalKeys,
      });
    });

    it('can return an array schema', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'array',
        ...allExpectedAdditionalKeys,
      });
    });

    it('can return an object schema', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'object',
        ...allExpectedAdditionalKeys,
      });
    });
  });

  context('with a typedSchema with combined schemas', function () {
    before(function () {
      this.typedSchema = {
        type: ['integer'],
        allOf: [
          {
            type: ['integer'],
            allOf: null,
            anyOf: null,
            oneOf: null,
            referenceId: 'subschemaA1',
            additionalSchemaKeys,
          },
          {
            type: ['string', 'integer'],
            allOf: null,
            anyOf: null,
            oneOf: null,
            referenceId: 'subschemaA2',
            additionalSchemaKeys,
          },
        ],
        anyOf: [
          {
            type: ['boolean'],
            allOf: null,
            anyOf: null,
            oneOf: null,
            referenceId: 'subschemaB1',
            additionalSchemaKeys,
          },
          {
            type: ['integer'],
            allOf: null,
            anyOf: null,
            oneOf: null,
            referenceId: 'subschemaB2',
            additionalSchemaKeys,
          },
          {
            type: ['string', 'array'],
            allOf: null,
            anyOf: null,
            oneOf: null,
            referenceId: 'subschemaB3',
            additionalSchemaKeys,
          },
          {
            type: ['string', 'integer'],
            allOf: null,
            anyOf: null,
            oneOf: null,
            referenceId: 'subschemaB4',
            additionalSchemaKeys,
          },
        ],
        oneOf: [
          {
            type: ['boolean'],
            allOf: null,
            anyOf: null,
            oneOf: null,
            referenceId: 'subschemaC1',
            additionalSchemaKeys,
          },
          {
            type: ['integer'],
            allOf: null,
            anyOf: null,
            oneOf: null,
            referenceId: 'subschemaC2',
            additionalSchemaKeys,
          },
          {
            type: ['string', 'array'],
            allOf: null,
            anyOf: null,
            oneOf: null,
            referenceId: 'subschemaC3',
            additionalSchemaKeys,
          },
          {
            type: ['string', 'integer'],
            allOf: null,
            anyOf: null,
            oneOf: null,
            referenceId: 'subschemaC4',
            additionalSchemaKeys,
          },
        ],
        additionalSchemaKeys,
      };

      this.result = testUnit(defaultMocker, 'selectType', this.typedSchema);
    });

    it('returns a schema with updated types and only compatible subschemas', function () {
      expect(this.result).to.eql({
        type: 'integer',
        allOf: [
          {
            type: 'integer',
            allOf: null,
            anyOf: null,
            oneOf: null,
            referenceId: 'subschemaA1',
            additionalSchemaKeys,
          },
          {
            type: 'integer',
            allOf: null,
            anyOf: null,
            oneOf: null,
            referenceId: 'subschemaA2',
            additionalSchemaKeys,
          },
        ],
        anyOf: [
          {
            type: 'integer',
            allOf: null,
            anyOf: null,
            oneOf: null,
            referenceId: 'subschemaB2',
            additionalSchemaKeys,
          },
          {
            type: 'integer',
            allOf: null,
            anyOf: null,
            oneOf: null,
            referenceId: 'subschemaB4',
            additionalSchemaKeys,
          },
        ],
        oneOf: [
          {
            type: 'integer',
            allOf: null,
            anyOf: null,
            oneOf: null,
            referenceId: 'subschemaC2',
            additionalSchemaKeys,
          },
          {
            type: 'integer',
            allOf: null,
            anyOf: null,
            oneOf: null,
            referenceId: 'subschemaC4',
            additionalSchemaKeys,
          },
        ],
        additionalSchemaKeys,
      });
    });
  });

  context('with a typedSchema with nested combined schemas', function () {
    before(function () {
      const typedSchema = {
        type: ['string'],
        allOf: [{
          type: ['boolean', 'string'],
          allOf: [{
            type: ['boolean', 'string'],
            allOf: null,
            anyOf: null,
            oneOf: null,
          }],
          anyOf: [{
            type: ['boolean', 'null', 'string'],
            allOf: null,
            anyOf: null,
            oneOf: null,
          }],
          oneOf: [{
            type: ['boolean', 'null', 'string'],
            allOf: null,
            anyOf: null,
            oneOf: null,
          }],
        }],
        anyOf: [{
          type: ['array', 'string'],
          allOf: [{
            type: ['array', 'null', 'string'],
            allOf: null,
            anyOf: null,
            oneOf: null,
          }],
          anyOf: [{
            type: ['array', 'string'],
            allOf: null,
            anyOf: null,
            oneOf: null,
          }],
          oneOf: [{
            type: ['array', 'null', 'string'],
            allOf: null,
            anyOf: null,
            oneOf: null,
          }],
        }],
        oneOf: [{
          type: ['object', 'string'],
          allOf: [{
            type: ['null', 'object', 'string'],
            allOf: null,
            anyOf: null,
            oneOf: null,
          }],
          anyOf: [{
            type: ['null', 'object', 'string'],
            allOf: null,
            anyOf: null,
            oneOf: null,
          }],
          oneOf: [{
            type: ['object', 'string'],
            allOf: null,
            anyOf: null,
            oneOf: null,
          }],
        }],
      };

      this.result = testUnit(defaultMocker, 'selectType', typedSchema);
    });

    it('updates all nested combined schemas', function () {
      expect(this.result).to.eql({
        type: 'string',
        allOf: [{
          type: 'string',
          allOf: [{
            type: 'string',
            allOf: null,
            anyOf: null,
            oneOf: null,
          }],
          anyOf: [{
            type: 'string',
            allOf: null,
            anyOf: null,
            oneOf: null,
          }],
          oneOf: [{
            type: 'string',
            allOf: null,
            anyOf: null,
            oneOf: null,
          }],
        }],
        anyOf: [{
          type: 'string',
          allOf: [{
            type: 'string',
            allOf: null,
            anyOf: null,
            oneOf: null,
          }],
          anyOf: [{
            type: 'string',
            allOf: null,
            anyOf: null,
            oneOf: null,
          }],
          oneOf: [{
            type: 'string',
            allOf: null,
            anyOf: null,
            oneOf: null,
          }],
        }],
        oneOf: [{
          type: 'string',
          allOf: [{
            type: 'string',
            allOf: null,
            anyOf: null,
            oneOf: null,
          }],
          anyOf: [{
            type: 'string',
            allOf: null,
            anyOf: null,
            oneOf: null,
          }],
          oneOf: [{
            type: 'string',
            allOf: null,
            anyOf: null,
            oneOf: null,
          }],
        }],
      });
    });
  });
});
