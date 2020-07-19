const _ = require('lodash');
const { lib } = require('../..');

const sandbox = sinon.createSandbox();

describe('createPseudoObjectSchema', function () {
  before(function () {
    this.propertySchema1 = Symbol('propertySchema1');
    this.propertySchema2 = Symbol('propertySchema2');
    this.propertySchema3 = Symbol('propertySchema3');
    this.propertySchema4 = Symbol('propertySchema4');
    this.propertySchema5 = Symbol('propertySchema5');

    this.defaultNestedSchema = Symbol('defaultNestedSchema');
    sandbox.stub(lib, 'generateDefaultNestedSchema').returns(this.defaultNestedSchema);
  });
  after(sandbox.restore);

  context('when the schema does not have any relevant keys', function () {
    before(function () {
      const singleTypedSchema = { type: 'object' };
      this.result = lib.createPseudoObjectSchema(singleTypedSchema);
    });

    it('returns a schema with default custom keys', function () {
      expect(this.result).to.eql({
        propertiesSchemas: {},
        propertyNamesToGenerate: [],
        shuffledOptionalPropertyNames: [],
        additionalPropertiesSchema: this.defaultNestedSchema,
        minProperties: 0,
        maxProperties: 3,
      });
    });
  });

  context('when the schema has "properties"', function () {
    before(function () {
      this.singleTypedSchema = {
        type: 'object',
        properties: {},
      };
      this.result = lib.createPseudoObjectSchema(this.singleTypedSchema);
    });

    it('returns a schema with a copy of "properties"', function () {
      expect(this.result.propertiesSchemas).to.eql({});
      expect(this.result.propertiesSchemas).to.not.equal(this.singleTypedSchema.properties);
    });
  });

  context('when the schema has "required"', function () {
    before(function () {
      this.singleTypedSchema = {
        type: 'object',
        required: ['property1', 'property2'],
      };
      this.result = lib.createPseudoObjectSchema(this.singleTypedSchema);
    });

    it('returns a schema with a copy of "required"', function () {
      expect(this.result.propertyNamesToGenerate).to.eql(['property1', 'property2']);
      expect(this.result.propertyNamesToGenerate).to.not.equal(this.singleTypedSchema.required);
    });
  });

  context('when the schema has a "required" that is a subset of "properties"', function () {
    before(function () {
      this.singleTypedSchema = {
        type: 'object',
        properties: {
          property2: this.propertySchema2,
          property3: this.propertySchema3,
          property4: this.propertySchema4,
          property5: this.propertySchema5,
        },
        required: ['property1', 'property3'],
      };

      const results = _.times(30, () => lib.createPseudoObjectSchema(this.singleTypedSchema));
      this.shuffledOptionalPropertyNamesResults = _.map(results, 'shuffledOptionalPropertyNames');
    });

    it('always returns a schema with optional property names', function () {
      expect(this.shuffledOptionalPropertyNamesResults).to.all.have.deep.members([
        'property2',
        'property4',
        'property5',
      ]);
    });

    it('sometimes returns optionalPropertyNames in the same order as defined in "properties"', function () {
      expect(this.shuffledOptionalPropertyNamesResults).to.include.something.that.eqls([
        'property2',
        'property4',
        'property5',
      ]);
    });

    it('sometimes returns optionalPropertyNames in a shuffled order', function () {
      expect(this.shuffledOptionalPropertyNamesResults).to.include.something.that.does.not.eql([
        'property2',
        'property4',
        'property5',
      ]);
    });
  });

  context('when "minProperties" is less than the number of required properties', function () {
    before(function () {
      const singleTypedSchema = {
        type: 'object',
        required: ['property1', 'property2'],
        minProperties: 1,
      };

      this.result = lib.createPseudoObjectSchema(singleTypedSchema);
    });

    it('returns a schema with an unchanged "minProperties"', function () {
      expect(this.result.minProperties).to.equal(1);
    });

    it('returns a schema with "maxProperties"', function () {
      expect(this.result.maxProperties).to.equal(5);
    });
  });

  context('when "minProperties" is less than the number of required and optional properties', function () {
    before(function () {
      const singleTypedSchema = {
        type: 'object',
        properties: {
          property3: this.propertySchema3,
          property4: this.propertySchema4,
        },
        required: ['property1', 'property2'],
        minProperties: 3,
      };

      this.result = lib.createPseudoObjectSchema(singleTypedSchema);
    });

    it('returns a schema with "minProperties"', function () {
      expect(this.result.minProperties).to.equal(3);
    });

    it('returns a schema with a "maxProperties" that is higher than the total number of properties', function () {
      expect(this.result.maxProperties).to.equal(7);
    });
  });

  context('when "minProperties" is greater than the number of required and optional properties', function () {
    before(function () {
      const singleTypedSchema = {
        type: 'object',
        properties: {
          property3: this.propertySchema3,
          property4: this.propertySchema4,
        },
        required: ['property1', 'property2'],
        minProperties: 7,
      };

      this.result = lib.createPseudoObjectSchema(singleTypedSchema);
    });

    it('returns a schema with "minProperties"', function () {
      expect(this.result.minProperties).to.equal(7);
    });

    it('returns a schema with "maxProperties" that is higher than "minProperties"', function () {
      expect(this.result.maxProperties).to.equal(10);
    });
  });

  context('when "maxProperties" is less than the number of required properties', function () {
    it('throws an error', function () {
      const singleTypedSchema = {
        type: 'object',
        maxProperties: 1,
        required: ['property1', 'property2'],
      };

      const testFn = () => {
        lib.createPseudoObjectSchema(singleTypedSchema);
      };

      expect(testFn).to.throw('Cannot generate data for conflicting "required" and "maxProperties"');
    });
  });

  context('when "maxProperties" is less than the total number of required and optional properties', function () {
    before(function () {
      const singleTypedSchema = {
        type: 'object',
        properties: {
          property3: this.propertySchema3,
          property4: this.propertySchema4,
          property5: this.propertySchema5,
          property6: this.propertySchema6,
          property7: this.propertySchema7,
        },
        required: ['property1', 'property2'],
        maxProperties: 3,
      };

      this.result = lib.createPseudoObjectSchema(singleTypedSchema);
    });

    it('returns a schema with "minProperties"', function () {
      expect(this.result.minProperties).to.equal(0);
    });

    it('returns a schema with "maxProperties"', function () {
      expect(this.result.maxProperties).to.equal(3);
    });
  });

  context('when "maxProperties" is higher than the total number of required and optional properties', function () {
    before(function () {
      const singleTypedSchema = {
        type: 'object',
        properties: {
          property4: this.propertySchema4,
        },
        required: ['property1', 'property2', 'property3'],
        maxProperties: 5,
      };

      this.result = lib.createPseudoObjectSchema(singleTypedSchema);
    });

    it('returns a schema with "minProperties"', function () {
      expect(this.result.minProperties).to.equal(0);
    });

    it('returns a schema with "maxProperties"', function () {
      expect(this.result.maxProperties).to.equal(5);
    });
  });

  context('when "minProperties" and "maxProperties" conflict', function () {
    it('throws an error', function () {
      const singleTypedSchema = {
        type: 'object',
        minProperties: 4,
        maxProperties: 3,
      };

      const testFn = () => {
        lib.createPseudoObjectSchema(singleTypedSchema);
      };

      expect(testFn).to.throw('Cannot generate data for conflicting "minProperties" and "maxProperties"');
    });
  });
});
