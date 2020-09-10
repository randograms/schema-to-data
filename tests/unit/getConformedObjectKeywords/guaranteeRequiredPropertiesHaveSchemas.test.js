const { defaultMocker } = require('../../../lib/mocker');

describe('getConformedObjectKeywords/guaranteeRequiredPropertiesHaveSchemas', function () {
  before(function () {
    this.propertySchema1 = { referenceId: 'propertySchema1' };
    this.propertySchema2 = { referenceId: 'propertySchema2' };
    this.propertySchema3 = { referenceId: 'propertySchema3' };
    this.additionalPropertiesSchema = { referenceId: 'additionalPropertiesSchema' };
  });

  context('when "patternPropertiesSchemas" is null', function () {
    before(function () {
      this.pseudoObjectSchema = {
        propertyNamesSchema: null,
        patternPropertiesSchemas: null,
        propertiesSchemas: {
          property2: this.propertySchema2,
          property4: true,
          property5: false,
        },
        propertyNamesToGenerate: ['property1', 'property2', 'property3', 'property4', 'property5'],
        shuffledOptionalPropertyNames: [],
        additionalPropertiesSchema: this.additionalPropertiesSchema,
        minProperties: { referenceId: 'minProperties' },
        maxProperties: { referenceId: 'maxProperties' },
      };

      this.result = testUnit(defaultMocker, 'guaranteeRequiredPropertiesHaveSchemas', this.pseudoObjectSchema);
    });

    it('updates propertiesSchemas to have a definition for every required property', function () {
      expect(this.pseudoObjectSchema.propertiesSchemas).to.eql({
        property1: this.additionalPropertiesSchema,
        property2: this.propertySchema2,
        property3: this.additionalPropertiesSchema,
        property4: true,
        property5: false,
      });
    });
  });

  context('when "patternPropertiesSchemas" is not null', function () {
    before(function () {
      this.propertySchema2 = { referenceId: 'propertySchema2' };
      this.additionalPropertiesSchema = { referenceId: 'additionalPropertiesSchema' };

      this.pseudoObjectSchema = {
        propertyNamesSchema: null,
        patternPropertiesSchemas: {
          erty1: this.propertySchema1,
          erty3: this.propertySchema3,
        },
        propertiesSchemas: {
          property2: this.propertySchema2,
          property4: true,
          property5: false,
        },
        propertyNamesToGenerate: ['property1', 'property2', 'property3', 'property4', 'property5', 'property6'],
        shuffledOptionalPropertyNames: [],
        additionalPropertiesSchema: this.additionalPropertiesSchema,
        minProperties: { referenceId: 'minProperties' },
        maxProperties: { referenceId: 'maxProperties' },
      };

      this.result = testUnit(defaultMocker, 'guaranteeRequiredPropertiesHaveSchemas', this.pseudoObjectSchema);
    });

    it('uses patternProperty schemas if applicable', function () {
      expect(this.pseudoObjectSchema.propertiesSchemas).to.eql({
        property1: this.propertySchema1,
        property2: this.propertySchema2,
        property3: this.propertySchema3,
        property4: true,
        property5: false,
        property6: this.additionalPropertiesSchema,
      });
    });
  });
});
