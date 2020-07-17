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
    const itemSchema1 = Symbol('itemSchema1');
    const itemSchema2 = Symbol('itemSchema2');
    const itemSchema3 = Symbol('itemSchema3');

    const coercedAnySchema = Symbol('coercedAnySchema');
    const coercedItemSchema1 = Symbol('coercedItemSchema1');
    const coercedItemSchema2 = Symbol('coercedItemSchema2');
    const coercedItemSchema3 = Symbol('coercedItemSchema3');

    before(function () {
      const stub = sandbox.stub(lib, 'coerceSchema');
      stub.withArgs({}).returns(coercedAnySchema);
      stub.withArgs(itemSchema1).returns(coercedItemSchema1);
      stub.withArgs(itemSchema2).returns(coercedItemSchema2);
      stub.withArgs(itemSchema3).returns(coercedItemSchema3);
    });
    after(sandbox.restore);

    const buildSaveResultForItems = (items) => function () {
      const typedSchema = generateValidTestSchema({
        type: 'array',
        items,
      });

      this.result = lib.conformSchemaToType(typedSchema);
    };

    const itSometimesReturnsASchemaWithAnEmptyItemsTuple = () => {
      it('sometimes returns a schema with an empty items tuple', function () {
        expect(this.result).to.eql({
          type: 'array',
          items: [],
        });
      });
    };

    const itSometimesReturnsASchemaWithAnItemsTupleWithOneItem = (expectedItemSchema) => {
      it('sometimes returns a schema with an items tuple with one item', function () {
        expect(this.result).to.eql({
          type: 'array',
          items: [expectedItemSchema],
        });
      });
    };

    const itSometimesReturnsASchemaWithAnItemsTupleWithMultipleItems = (
      expectedItemSchemaA,
      expectedItemSchemaB,
      expectedItemSchemaC,
    ) => {
      it('sometimes returns a schema with an items tuple with multiple items', function () {
        expect(this.result).to.eql({
          type: 'array',
          items: [expectedItemSchemaA, expectedItemSchemaB, expectedItemSchemaC],
        });
      });
    };

    context('that does not have an items definition', function () {
      beforeEach(buildSaveResultForItems(undefined));

      itSometimesReturnsASchemaWithAnEmptyItemsTuple();
      itSometimesReturnsASchemaWithAnItemsTupleWithOneItem(coercedAnySchema);
      itSometimesReturnsASchemaWithAnItemsTupleWithMultipleItems(coercedAnySchema, coercedAnySchema, coercedAnySchema);
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
