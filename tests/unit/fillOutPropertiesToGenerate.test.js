const _ = require('lodash');
const { defaultMocker } = require('../../lib/mocker');

const sandbox = sinon.createSandbox();

describe('fillOutPropertiesToGenerate', function () {
  before(function () {
    this.propertySchema1 = Symbol('propertySchema1');
    this.propertySchema2 = Symbol('propertySchema2');
    this.propertySchema3 = Symbol('propertySchema3');
    this.propertySchema4 = Symbol('propertySchema4');
    this.propertySchema5 = Symbol('propertySchema5');
    this.additionalPropertiesSchema = Symbol('additionalPropertiesSchema');
  });

  context('when the object size is less than the total number of required and optional properties', function () {
    before(function () {
      this.pseudoObjectSchema = {
        propertiesSchemas: {
          property1: this.propertySchema1,
          property2: this.propertySchema2,
          property3: this.propertySchema3,
          property4: this.propertySchema4,
          property5: this.propertySchema5,
        },
        propertyNamesToGenerate: ['property1', 'property2'],
        shuffledOptionalPropertyNames: ['property3', 'property4', 'property5'],
        additionalPropertiesSchema: this.additionalPropertiesSchema,
        minProperties: 4,
        maxProperties: 4,
      };

      this.result = defaultMocker.fillOutPropertiesToGenerate(this.pseudoObjectSchema);
    });

    it('returns undefined', function () {
      expect(this.result).to.be.undefined;
    });

    it('removes properties from "shuffledOptionalPropertyNames"', function () {
      expect(this.pseudoObjectSchema.shuffledOptionalPropertyNames).to.eql(['property5']);
    });

    it('adds the properties to "propertyNamesToGenerate"', function () {
      expect(this.pseudoObjectSchema.propertyNamesToGenerate).to.eql([
        'property1',
        'property2',
        'property3',
        'property4',
      ]);
    });
  });

  context('when the object size is greater than the total number of required and optional properties', function () {
    before(function () {
      sandbox.stub(defaultMocker, 'generateAdditionalPropertyName').callsFake(() => (
        `additionalProperty${defaultMocker.generateAdditionalPropertyName.callCount}`
      ));

      this.pseudoObjectSchema = {
        propertiesSchemas: {
          property1: this.propertySchema1,
          property2: this.propertySchema2,
          property3: this.propertySchema3,
        },
        propertyNamesToGenerate: ['property1', 'property2'],
        shuffledOptionalPropertyNames: ['property3'],
        additionalPropertiesSchema: this.additionalPropertiesSchema,
        minProperties: 5,
        maxProperties: 5,
      };

      this.result = defaultMocker.fillOutPropertiesToGenerate(this.pseudoObjectSchema);
    });
    after(sandbox.restore);

    it('returns undefined', function () {
      expect(this.result).to.be.undefined;
    });

    it('removes properties from "shuffledOptionalPropertyNames"', function () {
      expect(this.pseudoObjectSchema.shuffledOptionalPropertyNames).to.eql([]);
    });

    it('appends additional properties to "propertiesSchemas"', function () {
      expect(this.pseudoObjectSchema.propertiesSchemas).to.eql({
        property1: this.propertySchema1,
        property2: this.propertySchema2,
        property3: this.propertySchema3,
        additionalProperty1: this.additionalPropertiesSchema,
        additionalProperty2: this.additionalPropertiesSchema,
      });
    });

    it('appends additional property names to "propertyNamesToGenerate"', function () {
      expect(this.pseudoObjectSchema.propertyNamesToGenerate).to.eql([
        'property1',
        'property2',
        'property3',
        'additionalProperty1',
        'additionalProperty2',
      ]);
    });
  });

  // regression
  context('when a duplicate additional property name is generated', function () {
    before(function () {
      const stub = sandbox.stub(defaultMocker, 'generateAdditionalPropertyName');
      stub.onFirstCall().returns('additionalProperty1');
      stub.onSecondCall().returns('additionalProperty1');
      stub.onThirdCall().returns('additionalProperty2');

      this.pseudoObjectSchema = {
        propertiesSchemas: {
          property1: this.propertySchema1,
          property2: this.propertySchema2,
        },
        propertyNamesToGenerate: ['property1', 'property2'],
        shuffledOptionalPropertyNames: [],
        additionalPropertiesSchema: this.additionalPropertiesSchema,
        minProperties: 4,
        maxProperties: 4,
      };

      this.result = defaultMocker.fillOutPropertiesToGenerate(this.pseudoObjectSchema);
    });
    after(sandbox.restore);

    it('returns undefined', function () {
      expect(this.result).to.be.undefined;
    });

    it('continues to generate additional properties to append to "propertiesSchemas"', function () {
      expect(this.pseudoObjectSchema.propertiesSchemas).to.eql({
        property1: this.propertySchema1,
        property2: this.propertySchema2,
        additionalProperty1: this.additionalPropertiesSchema,
        additionalProperty2: this.additionalPropertiesSchema,
      });
    });

    it('appends additional property names to "propertyNamesToGenerate"', function () {
      expect(this.pseudoObjectSchema.propertyNamesToGenerate).to.eql([
        'property1',
        'property2',
        'additionalProperty1',
        'additionalProperty2',
      ]);
    });
  });

  context('when size can vary', function () {
    this.retries(10);

    beforeEach(function () {
      sandbox.stub(defaultMocker, 'generateAdditionalPropertyName').callsFake(() => (
        `additionalProperty${defaultMocker.generateAdditionalPropertyName.callCount}`
      ));

      this.pseudoObjectSchema = {
        propertiesSchemas: {
          property1: this.propertySchema1,
          property2: this.propertySchema2,
          property3: this.propertySchema3,
        },
        propertyNamesToGenerate: ['property1', 'property2'],
        shuffledOptionalPropertyNames: ['property3'],
        additionalPropertiesSchema: this.additionalPropertiesSchema,
        minProperties: 1,
        maxProperties: 4,
      };

      defaultMocker.fillOutPropertiesToGenerate(this.pseudoObjectSchema);

      this.assertionResult = _.pick(this.pseudoObjectSchema, [
        'propertiesSchemas',
        'propertyNamesToGenerate',
        'shuffledOptionalPropertyNames',
      ]);
    });
    afterEach(sandbox.restore);

    it('sometimes does not append any more properties to "propertyNamesToGenerate"', function () {
      expect(this.assertionResult).to.eql({
        propertiesSchemas: {
          property1: this.propertySchema1,
          property2: this.propertySchema2,
          property3: this.propertySchema3,
        },
        propertyNamesToGenerate: ['property1', 'property2'],
        shuffledOptionalPropertyNames: ['property3'],
      });
    });

    it('sometimes only appends optional properties to "propertyNamesToGenerate"', function () {
      expect(this.assertionResult).to.eql({
        propertiesSchemas: {
          property1: this.propertySchema1,
          property2: this.propertySchema2,
          property3: this.propertySchema3,
        },
        propertyNamesToGenerate: ['property1', 'property2', 'property3'],
        shuffledOptionalPropertyNames: [],
      });
    });

    it('sometimes appends optional additional properties to "propertyNamesToGenerate"', function () {
      expect(this.assertionResult).to.eql({
        propertiesSchemas: {
          property1: this.propertySchema1,
          property2: this.propertySchema2,
          property3: this.propertySchema3,
          additionalProperty1: this.additionalPropertiesSchema,
        },
        propertyNamesToGenerate: ['property1', 'property2', 'property3', 'additionalProperty1'],
        shuffledOptionalPropertyNames: [],
      });
    });
  });
});
