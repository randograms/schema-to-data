const _ = require('lodash');
const { lib } = require('../..');

const sandbox = sinon.createSandbox();

const generateValidTestSchema = ({ type = [], ...additionalSchemaKeys } = {}) => ({ type, ...additionalSchemaKeys });

describe('conformSchemaToType', function () {
  context('with a typedSchema with a single type', function () {
    before(function () {
      const typedSchema = generateValidTestSchema({
        type: ['integer'],
        unsupportedSchemaKey: Symbol('unsupportedSchemaKey'),
      });

      this.result = lib.conformSchemaToType(typedSchema);
    });

    it('returns a schema with a single string type', function () {
      expect(this.result.type).to.be.a('string').and.to.equal('integer');
    });

    it('returns a schema without unsupported keys', function () {
      expect(this.result.unsupportedSchemaKey).to.be.undefined;
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
        unsupportedSchemaKey: Symbol('unsupportedSchemaKey'),
      };
      const typedSchema = generateValidTestSchema(this.typedSchema);

      this.results = _.times(10, () => lib.conformSchemaToType(typedSchema));
    });

    it('always returns a schema with a single type', function () {
      expect(this.results).to.all.satisfy((data) => _.isString(data.type));
    });

    it('always returns a copy of the schema', function () {
      expect(this.results).to.not.include.something.that.equals(this.typedSchema);
    });

    it('can return a null schema with only relevant keys', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'null',
      });
    });

    it('can return a string schema with only relevant keys', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'string',
        minLength: 0,
        maxLength: 20,
      });
    });

    it('can return a decimal schema with only relevant keys', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'decimal',
        minimum: -100000,
        maximum: 100000,
      });
    });

    it('can return an integer schema with only relevant keys', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'integer',
        minimum: -100000,
        maximum: 100000,
      });
    });

    it('can return a boolean schema with only relevant keys', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'boolean',
      });
    });

    it('can return an array schema with only relevant keys', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'array',
        items: [],
      });
    });

    it('can return an object schema with only relevant keys', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'object',
        properties: {},
        required: [],
      });
    });
  });

  context('with a string typedSchema', function () {
    context('when minLength exceeds the default maxLength', function () {
      before(function () {
        const typedSchema = generateValidTestSchema({
          type: ['string'],
          minLength: 1000,
        });

        this.result = lib.conformSchemaToType(typedSchema);
      });

      it('adjusts the maxLength', function () {
        expect(this.result).to.be.like({
          minLength: 1000,
          maxLength: 1020,
        });
      });
    });
  });

  describe('number typedSchemas', function () {
    const testCommonBehavior = (type) => {
      context('when "minimum" exceeds the default maximum', function () {
        before(function () {
          const schema = generateValidTestSchema({
            type: [type],
            minimum: 200000,
          });

          this.result = lib.conformSchemaToType(schema);
        });

        it('adjusts the maximum', function () {
          expect(this.result).to.be.like({
            minimum: 200000,
            maximum: 400000,
          });
        });
      });

      context('when "maximum" is less than the default minimum', function () {
        before(function () {
          const schema = generateValidTestSchema({
            type: [type],
            maximum: -200000,
          });

          this.result = lib.conformSchemaToType(schema);
        });

        it('adjusts the minimum', function () {
          expect(this.result).to.be.like({
            minimum: -400000,
            maximum: -200000,
          });
        });
      });
    };

    context('with a "decimal" typedSchema', function () {
      testCommonBehavior('decimal');
    });

    context('with an "integer" typedSchema', function () {
      testCommonBehavior('integer');

      context('when minimum and maximum are decimals', function () {
        before(function () {
          const schema = generateValidTestSchema({
            type: ['integer'],
            minimum: -5.3,
            maximum: 2.1,
          });

          this.result = lib.conformSchemaToType(schema);
        });

        it('adjusts them to be integers', function () {
          expect(this.result).to.eql({
            type: 'integer',
            minimum: -5,
            maximum: 2,
          });
        });
      });
    });
  });

  context('with an array typedSchema', function () {
    context('that has an items tuple', function () {
      before(function () {
        const itemSchema1 = Symbol('itemSchema1');
        const itemSchema2 = Symbol('itemSchema2');
        const itemSchema3 = Symbol('itemSchema3');
        this.coercedItemSchema1 = Symbol('coercedItemSchema1');
        this.coercedItemSchema2 = Symbol('coercedItemSchema2');
        this.coercedItemSchema3 = Symbol('coercedItemSchema3');

        const stub = sandbox.stub(lib, 'coerceSchema');
        stub.withArgs(itemSchema1).returns(this.coercedItemSchema1);
        stub.withArgs(itemSchema2).returns(this.coercedItemSchema2);
        stub.withArgs(itemSchema3).returns(this.coercedItemSchema3);

        const typedSchema = generateValidTestSchema({
          type: ['array'],
          items: [itemSchema1, itemSchema2, itemSchema3],
        });

        this.result = lib.conformSchemaToType(typedSchema);
      });
      after(sandbox.restore);

      it('returns a schema with a coerced items tuple', function () {
        expect(this.result.items).to.eql([
          this.coercedItemSchema1,
          this.coercedItemSchema2,
          this.coercedItemSchema3,
        ]);
      });
    });

    context('that has an items schema', function () {
      this.retries(3);

      beforeEach(function () {
        const itemSchema = Symbol('itemSchema');
        this.coercedItemSchema1 = Symbol('coercedItemSchema1');
        this.coercedItemSchema2 = Symbol('coercedItemSchema2');
        this.coercedItemSchema3 = Symbol('coercedItemSchema3');

        const typedSchema = generateValidTestSchema({
          type: ['array'],
          items: itemSchema,
        });

        this.results = _.times(10, () => {
          const stub = sandbox.stub(lib, 'coerceSchema');
          stub.withArgs(itemSchema).onFirstCall().returns(this.coercedItemSchema1);
          stub.withArgs(itemSchema).onSecondCall().returns(this.coercedItemSchema2);
          stub.withArgs(itemSchema).onThirdCall().returns(this.coercedItemSchema3);

          const result = lib.conformSchemaToType(typedSchema);
          stub.restore();

          return result;
        });
      });

      it('sometimes returns a schema with an empty items tuple', function () {
        expect(this.results).to.include.something.like({ items: [] });
      });

      it('sometimes returns a schema with an items tuple with one coerced schema', function () {
        expect(this.results).to.include.something.like({ items: [this.coercedItemSchema1] });
      });

      it('sometimes returns a schema with an items tuple with multiple coerced schemas', function () {
        expect(this.results).to.include.something.like({
          items: [
            this.coercedItemSchema1,
            this.coercedItemSchema2,
            this.coercedItemSchema3,
          ],
        });
      });
    });
  });

  context('with an object typedSchema', function () {
    context('that has "properties"', function () {
      before(function () {
        const propertySchema1 = Symbol('propertySchema1');
        const propertySchema2 = Symbol('propertySchema2');
        this.coercedPropertySchema1 = Symbol('coercedPropertySchema1');
        this.coercedPropertySchema2 = Symbol('coercedPropertySchema2');

        const stub = sandbox.stub(lib, 'coerceSchema');
        stub.withArgs(propertySchema1).returns(this.coercedPropertySchema1);
        stub.withArgs(propertySchema2).returns(this.coercedPropertySchema2);

        const typedSchema = generateValidTestSchema({
          type: ['object'],
          properties: {
            property1: propertySchema1,
            property2: propertySchema2,
          },
        });

        this.result = lib.conformSchemaToType(typedSchema);
      });
      after(sandbox.restore);

      it('returns a schema with the coerced property definitions', function () {
        expect(this.result).to.be.like({
          properties: {
            property1: this.coercedPropertySchema1,
            property2: this.coercedPropertySchema2,
          },
        });
      });
    });

    context('that has a required property without a schema', function () {
      before(function () {
        this.coercedPropertySchema = Symbol('coercedPropertySchema');
        sandbox.stub(lib, 'coerceSchema').withArgs({}).returns(this.coercedPropertySchema);

        const typedSchema = generateValidTestSchema({
          type: ['object'],
          required: ['property'],
        });

        this.result = lib.conformSchemaToType(typedSchema);
      });
      after(sandbox.restore);

      it('returns a schema with a coerced property definition', function () {
        expect(this.result).to.be.like({
          properties: {
            property: this.coercedPropertySchema,
          },
          required: ['property'],
        });
      });
    });
  });

  context('with a typedSchema with an empty type set', function () {
    it('returns a copy of the schema', function () {
      const typedSchema = generateValidTestSchema({ type: [], unsupportedSchemaKey: Symbol('unsupportedSchemaKey') });
      const result = lib.conformSchemaToType(typedSchema);
      expect(result).to.eql({ type: undefined });
    });
  });

  context('with a typedSchema with a malformed type', function () {
    it('returns a copy of the schema', function () {
      const typedSchema = generateValidTestSchema({
        type: ['whoops'],
        unsupportedSchemaKey: Symbol('unsupportedSchemaKey'),
      });
      const result = lib.conformSchemaToType(typedSchema);
      expect(result).to.eql({ type: 'whoops' });
    });
  });
});
