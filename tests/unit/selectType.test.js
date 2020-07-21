const _ = require('lodash');
const { lib } = require('../..');

const sandbox = sinon.createSandbox();

const generateValidTestSchema = ({ type = [], ...additionalSchemaKeys } = {}) => ({ type, ...additionalSchemaKeys });

describe('selectType', function () {
  before(function () {
    this.defaultNestedSchema = Symbol('defaultNestedSchema');
    sandbox.stub(lib, 'generateDefaultNestedSchema').returns(this.defaultNestedSchema);
  });
  after(sandbox.restore);

  context('with a typedSchema with a single type', function () {
    before(function () {
      const typedSchema = generateValidTestSchema({
        type: ['integer'],
      });

      this.result = lib.selectType(typedSchema);
    });

    it('returns a schema with a single string type', function () {
      expect(this.result.type).to.be.a('string').and.to.equal('integer');
    });
  });

  context('with a typedSchema with multiple types', function () {
    this.retries(20);

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
      };
      const typedSchema = generateValidTestSchema(this.typedSchema);

      this.results = _.times(10, () => lib.selectType(typedSchema));
    });

    it('always returns a schema with a single type', function () {
      expect(this.results).to.all.satisfy((data) => _.isString(data.type));
    });

    it('always returns a copy of the schema', function () {
      expect(this.results).to.not.include.something.that.equals(this.typedSchema);
    });

    it('can return a null schema', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'null',
      });
    });

    it('can return a string schema', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'string',
      });
    });

    it('can return a decimal schema', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'decimal',
      });
    });

    it('can return an integer schema', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'integer',
      });
    });

    it('can return a boolean schema', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'boolean',
      });
    });

    it('can return an array schema with a default items tuple and additionalItems definition', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'array',
        items: [this.defaultNestedSchema],
        additionalItems: this.defaultNestedSchema,
      });
    });

    it('can return an object schema', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'object',
      });
    });
  });

  context('with an array typedSchema', function () {
    context('that has a list items definition', function () {
      before(function () {
        this.itemSchema = Symbol('itemSchema');

        const typedSchema = generateValidTestSchema({
          type: ['array'],
          items: this.itemSchema,
        });

        this.result = lib.selectType(typedSchema);
      });

      it('returns a schema with the item schema as the items tuple and the additionalItems', function () {
        expect(this.result).to.eql({
          type: 'array',
          items: [this.itemSchema],
          additionalItems: this.itemSchema,
        });
      });
    });

    context('that has a tuple items definition', function () {
      before(function () {
        this.itemSchema1 = Symbol('itemSchema1');
        this.itemSchema2 = Symbol('itemSchema2');
        this.itemSchema3 = Symbol('itemSchema3');

        const typedSchema = generateValidTestSchema({
          type: ['array'],
          items: [this.itemSchema1, this.itemSchema2, this.itemSchema3],
        });

        this.result = lib.selectType(typedSchema);
      });

      it('returns a schema with tuple items and a default additionalItems', function () {
        expect(this.result).to.eql({
          type: 'array',
          items: [this.itemSchema1, this.itemSchema2, this.itemSchema3],
          additionalItems: this.defaultNestedSchema,
        });
      });
    });

    context('that has a "false" literal items schema', function () {
      before(function () {
        const typedSchema = generateValidTestSchema({
          type: ['array'],
          items: false,
        });

        this.result = lib.selectType(typedSchema);
      });

      it('returns a schema with an empty items tuple and restricted length', function () {
        expect(this.result).to.eql({
          type: 'array',
          items: [],
          minItems: 0,
          maxItems: 0,
          additionalItems: false,
        });
      });
    });

    context('that has a "false" literal items schema and non-zero "minItems"', function () {
      it('throws an error', function () {
        const typedSchema = generateValidTestSchema({
          type: ['array'],
          items: false,
          minItems: 1,
        });

        const testFn = () => {
          lib.selectType(typedSchema);
        };

        expect(testFn).to.throw('Cannot generate array items for "false" literal items schema and non-zero "minItems"');
      });
    });
  });

  context('with a typedSchema with a malformed type', function () {
    it('returns a copy of the schema with a single type', function () {
      const additionalSchemaKeys = Symbol('additionalSchemaKeys');
      const typedSchema = generateValidTestSchema({
        type: ['whoops'],
        additionalSchemaKeys,
      });

      const result = lib.selectType(typedSchema);
      expect(result).to.not.equal(typedSchema);
      expect(result).to.eql({
        type: 'whoops',
        additionalSchemaKeys,
      });
    });
  });
});