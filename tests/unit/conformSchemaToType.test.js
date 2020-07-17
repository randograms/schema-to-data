const { lib } = require('../..');

const sandbox = sinon.createSandbox();

const generateValidTestSchema = ({ type = '', ...additionalSchemaKeys } = {}) => ({
  type,
  ...additionalSchemaKeys,
  unsupportedSchemaKey: Symbol('unsupportedSchemaKey'),
});

describe('conformSchemaToType', function () {
  context('with a string singleTypedSchema', function () {
    context('by default', function () {
      it('returns a schema with relevant keys', function () {
        const singleTypedSchema = generateValidTestSchema({ type: 'string' });
        expect(lib.conformSchemaToType(singleTypedSchema)).to.eql({
          type: 'string',
          minLength: 0,
          maxLength: 20,
        });
      });
    });

    context('when minLength exceeds the default maxLength', function () {
      before(function () {
        const typedSchema = generateValidTestSchema({
          type: 'string',
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

  describe('number singleTypedSchema', function () {
    const testCommonBehavior = (type) => {
      context('by default', function () {
        it('returns a schema with relevant keys', function () {
          const singleTypedSchema = generateValidTestSchema({ type });
          expect(lib.conformSchemaToType(singleTypedSchema)).to.eql({
            type,
            minimum: -100000,
            maximum: 100000,
          });
        });
      });

      context('when "minimum" exceeds the default maximum', function () {
        before(function () {
          const schema = generateValidTestSchema({
            type,
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
            type,
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
            type: 'integer',
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

  context('with an array singleTypedSchema', function () {
    this.retries(30);

    before(function () {
      this.itemSchema1 = Symbol('itemSchema1');
      this.itemSchema2 = Symbol('itemSchema2');
      this.itemSchema3 = Symbol('itemSchema3');
      this.additionalItemsSchema = Symbol('additionalItemsSchema');

      this.coercedItemSchema1 = Symbol('coercedItemSchema1');
      this.coercedItemSchema2 = Symbol('coercedItemSchema2');
      this.coercedItemSchema3 = Symbol('coercedItemSchema3');
      this.coercedAdditionalItemsSchema = Symbol('coercedAdditionalItemsSchema');

      const stub = sandbox.stub(lib, 'coerceSchema');
      stub.withArgs(this.itemSchema1).returns(this.coercedItemSchema1);
      stub.withArgs(this.itemSchema2).returns(this.coercedItemSchema2);
      stub.withArgs(this.itemSchema3).returns(this.coercedItemSchema3);
      stub.withArgs(this.additionalItemsSchema).returns(this.coercedAdditionalItemsSchema);
    });
    after(sandbox.restore);

    beforeEach(function () {
      const typedSchema = generateValidTestSchema({
        type: 'array',
        items: [this.itemSchema1, this.itemSchema2, this.itemSchema3],
        additionalItems: this.additionalItemsSchema,
      });

      this.result = lib.conformSchemaToType(typedSchema);
    });

    it('sometimes returns a schema with an empty items tuple', function () {
      expect(this.result).to.eql({
        type: 'array',
        items: [],
      });
    });

    it('sometimes returns a schema with an items tuple with one item', function () {
      expect(this.result).to.eql({
        type: 'array',
        items: [this.coercedItemSchema1],
      });
    });

    it('sometimes returns a schema with all tuple items', function () {
      expect(this.result).to.eql({
        type: 'array',
        items: [this.coercedItemSchema1, this.coercedItemSchema2, this.coercedItemSchema3],
      });
    });

    it('sometimes returns a schema with additional items', function () {
      expect(this.result).to.eql({
        type: 'array',
        items: [
          this.coercedItemSchema1,
          this.coercedItemSchema2,
          this.coercedItemSchema3,
          this.coercedAdditionalItemsSchema,
          this.coercedAdditionalItemsSchema,
        ],
      });
    });
  });

  context('with an object singleTypedSchema', function () {
    context('by default', function () {
      it('returns a schema with relevant keys', function () {
        const singleTypedSchema = generateValidTestSchema({ type: 'object' });
        expect(lib.conformSchemaToType(singleTypedSchema)).to.eql({
          type: 'object',
          properties: {},
          required: [],
        });
      });
    });

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
          type: 'object',
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
          type: 'object',
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

  context('with a singleTypedSchema with a malformed type', function () {
    it('returns a schema with just the type', function () {
      const singleTypedSchema = generateValidTestSchema({
        type: 'whoops',
        unsupportedSchemaKey: Symbol('unsupportedSchemaKey'),
      });

      const result = lib.conformSchemaToType(singleTypedSchema);
      expect(result).to.not.equal(singleTypedSchema);
      expect(result).to.eql({ type: 'whoops' });
    });
  });
});
