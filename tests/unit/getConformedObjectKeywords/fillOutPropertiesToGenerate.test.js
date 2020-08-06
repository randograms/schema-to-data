const _ = require('lodash');
const { defaultMocker } = require('../../../lib/mocker');
const { setupCustomMocker } = require('../helpers/setupCustomMocker');

const sandbox = sinon.createSandbox();

describe('getConformedObjectKeywords/fillOutPropertiesToGenerate', function () {
  before(function () {
    this.propertySchema1 = Symbol('propertySchema1');
    this.propertySchema2 = Symbol('propertySchema2');
    this.propertySchema3 = Symbol('propertySchema3');
    this.propertySchema4 = Symbol('propertySchema4');
    this.propertySchema5 = Symbol('propertySchema5');
    this.additionalPropertiesSchema = Symbol('additionalPropertiesSchema');
  });

  context('when "optionalPropertyPrioritization" is 0', function () {
    setupCustomMocker({ optionalPropertyPrioritization: 0 });

    before(function () {
      sandbox.stub(this.mocker, 'generateAdditionalPropertyName').callsFake(() => (
        `additionalProperty${this.mocker.generateAdditionalPropertyName.callCount}`
      ));

      this.pseudoObjectSchema = {
        propertiesSchemas: {
          property1: this.propertySchema1,
          property2: this.propertySchema2,
          property3: this.propertySchema3,
          property4: this.propertySchema4,
        },
        propertyNamesToGenerate: ['property1', 'property2'],
        shuffledOptionalPropertyNames: ['property3', 'property4'],
        additionalPropertiesSchema: this.additionalPropertiesSchema,
        minProperties: 6,
        maxProperties: 6,
      };

      this.result = this.mocker.fillOutPropertiesToGenerate(this.pseudoObjectSchema);
    });
    after(sandbox.restore);

    it('returns undefined', function () {
      expect(this.result).to.be.undefined;
    });

    it('does not remove properties from "shuffledOptionalPropertyNames"', function () {
      expect(this.pseudoObjectSchema.shuffledOptionalPropertyNames).to.eql(['property3', 'property4']);
    });

    it('appends additional properties to "propertiesSchemas"', function () {
      expect(this.pseudoObjectSchema.propertiesSchemas).to.eql({
        property1: this.propertySchema1,
        property2: this.propertySchema2,
        property3: this.propertySchema3,
        property4: this.propertySchema4,
        additionalProperty1: this.additionalPropertiesSchema,
        additionalProperty2: this.additionalPropertiesSchema,
        additionalProperty3: this.additionalPropertiesSchema,
        additionalProperty4: this.additionalPropertiesSchema,
      });
    });

    it('appends additional property names to "propertyNamesToGenerate"', function () {
      expect(this.pseudoObjectSchema.propertyNamesToGenerate).to.eql([
        'property1',
        'property2',
        'additionalProperty1',
        'additionalProperty2',
        'additionalProperty3',
        'additionalProperty4',
      ]);
    });
  });

  context('when "optionalPropertyPrioritization" is 1', function () {
    setupCustomMocker({ optionalPropertyPrioritization: 1 });

    before(function () {
      sandbox.stub(this.mocker, 'generateAdditionalPropertyName').callsFake(() => (
        `additionalProperty${this.mocker.generateAdditionalPropertyName.callCount}`
      ));

      this.pseudoObjectSchema = {
        propertiesSchemas: {
          property1: this.propertySchema1,
          property2: this.propertySchema2,
          property3: this.propertySchema3,
          property4: this.propertySchema4,
        },
        propertyNamesToGenerate: ['property1', 'property2'],
        shuffledOptionalPropertyNames: ['property3', 'property4'],
        additionalPropertiesSchema: this.additionalPropertiesSchema,
        minProperties: 6,
        maxProperties: 6,
      };

      this.result = this.mocker.fillOutPropertiesToGenerate(this.pseudoObjectSchema);
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
        property4: this.propertySchema4,
        additionalProperty1: this.additionalPropertiesSchema,
        additionalProperty2: this.additionalPropertiesSchema,
      });
    });

    it('appends additional property names to "propertyNamesToGenerate"', function () {
      expect(this.pseudoObjectSchema.propertyNamesToGenerate).to.eql([
        'property1',
        'property2',
        'property3',
        'property4',
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

  context('when "optionalPropertyPrioritization" is between 0 and 1 and the object size can vary', function () {
    this.retries(50);
    setupCustomMocker({ optionalPropertyPrioritization: 0.5 });

    beforeEach(function () {
      sandbox.stub(this.mocker, 'generateAdditionalPropertyName').callsFake(() => (
        `additionalProperty${this.mocker.generateAdditionalPropertyName.callCount}`
      ));

      this.pseudoObjectSchema = {
        propertiesSchemas: {
          property1: this.propertySchema1,
          property2: this.propertySchema2,
          property3: this.propertySchema3,
          property4: this.propertySchema4,
        },
        propertyNamesToGenerate: ['property1', 'property2'],
        shuffledOptionalPropertyNames: ['property3', 'property4'],
        additionalPropertiesSchema: this.additionalPropertiesSchema,
        minProperties: 2,
        maxProperties: 4,
      };

      this.mocker.fillOutPropertiesToGenerate(this.pseudoObjectSchema);

      this.assertionResult = _.pick(this.pseudoObjectSchema, [
        'propertiesSchemas',
        'propertyNamesToGenerate',
        'shuffledOptionalPropertyNames',
      ]);
    });
    afterEach(sandbox.restore);

    it('sometimes does not append any more properties', function () {
      expect(this.assertionResult).to.eql({
        propertiesSchemas: {
          property1: this.propertySchema1,
          property2: this.propertySchema2,
          property3: this.propertySchema3,
          property4: this.propertySchema4,
        },
        propertyNamesToGenerate: ['property1', 'property2'],
        shuffledOptionalPropertyNames: ['property3', 'property4'],
      });
    });

    it('sometimes only appends optional properties', function () {
      expect(this.assertionResult).to.eql({
        propertiesSchemas: {
          property1: this.propertySchema1,
          property2: this.propertySchema2,
          property3: this.propertySchema3,
          property4: this.propertySchema4,
        },
        propertyNamesToGenerate: ['property1', 'property2', 'property3', 'property4'],
        shuffledOptionalPropertyNames: [],
      });
    });

    it('sometimes appends optional and additional properties', function () {
      expect(this.assertionResult).to.eql({
        propertiesSchemas: {
          property1: this.propertySchema1,
          property2: this.propertySchema2,
          property3: this.propertySchema3,
          property4: this.propertySchema4,
          additionalProperty1: this.additionalPropertiesSchema,
        },
        propertyNamesToGenerate: ['property1', 'property2', 'property3', 'additionalProperty1'],
        shuffledOptionalPropertyNames: ['property4'],
      });
    });

    it('sometimes appends additional and optional properties', function () {
      expect(this.assertionResult).to.eql({
        propertiesSchemas: {
          property1: this.propertySchema1,
          property2: this.propertySchema2,
          property3: this.propertySchema3,
          property4: this.propertySchema4,
          additionalProperty1: this.additionalPropertiesSchema,
        },
        propertyNamesToGenerate: ['property1', 'property2', 'additionalProperty1', 'property3'],
        shuffledOptionalPropertyNames: ['property4'],
      });
    });

    it('sometimes only appends additional properties', function () {
      expect(this.assertionResult).to.eql({
        propertiesSchemas: {
          property1: this.propertySchema1,
          property2: this.propertySchema2,
          property3: this.propertySchema3,
          property4: this.propertySchema4,
          additionalProperty1: this.additionalPropertiesSchema,
          additionalProperty2: this.additionalPropertiesSchema,
        },
        propertyNamesToGenerate: ['property1', 'property2', 'additionalProperty1', 'additionalProperty2'],
        shuffledOptionalPropertyNames: ['property3', 'property4'],
      });
    });
  });
});
