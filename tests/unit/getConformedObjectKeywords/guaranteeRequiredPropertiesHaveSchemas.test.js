const { defaultMocker } = require('../../../lib/mocker');

describe('getConformedObjectKeywords/guaranteeRequiredPropertiesHaveSchemas', function () {
  before(function () {
    this.propertySchema2 = { referenceId: 'propertySchema2' };
    this.additionalPropertiesSchema = { referenceId: 'additionalPropertiesSchema' };

    this.pseudoObjectSchema = {
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
