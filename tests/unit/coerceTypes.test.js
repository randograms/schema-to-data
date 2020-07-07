const { lib } = require('../..');

describe('coerceTypes', function () {
  const additionalSchemaKeys = Symbol('additionalSchemaKeys');

  const buildSetupResultForSchemaWithType = (type) => function () {
    this.schema = {
      type,
      additionalSchemaKeys,
    };

    this.result = lib.coerceTypes(this.schema);
  };

  const itReturnsACopyOfTheSchema = () => {
    it('returns a copy of the schema', function () {
      expect(this.result).to.not.equal(this.schema);
      expect(this.result.additionalSchemaKeys).to.equal(additionalSchemaKeys);
    });
  };

  const itReturnsASchemaWithATypeArray = () => {
    it('returns a schema with an array of types', function () {
      expect(this.result.type).to.be.an('array');
    });
  };

  context('when the schema does not have a type', function () {
    before(buildSetupResultForSchemaWithType(undefined));

    itReturnsACopyOfTheSchema();
    itReturnsASchemaWithATypeArray();

    it('returns a schema with all data types', function () {
      expect(this.result.type).to.eql([
        'null',
        'string',
        'number',
        'integer',
        'boolean',
        'array',
        'object',
      ]);
    });
  });

  context('when the schema has a string type', function () {
    before(buildSetupResultForSchemaWithType('boolean'));

    itReturnsACopyOfTheSchema();
    itReturnsASchemaWithATypeArray();

    it('returns a schema with a single data type', function () {
      expect(this.result.type).to.eql(['boolean']);
    });
  });

  context('when the schema has a type array', function () {
    before(buildSetupResultForSchemaWithType(['number', 'boolean']));

    itReturnsACopyOfTheSchema();
    itReturnsASchemaWithATypeArray();

    it('returns a schema with a copy of the data types', function () {
      expect(this.result.type).to.eql(['number', 'boolean']);
      expect(this.result.type).to.not.equal(this.schema.type);
    });
  });

  context('when the schemas type field is an invalid data type', function () {
    before(buildSetupResultForSchemaWithType(false));

    itReturnsACopyOfTheSchema();
    itReturnsASchemaWithATypeArray();

    it('returns a schema with all data types', function () {
      expect(this.result.type).to.eql([
        'null',
        'string',
        'number',
        'integer',
        'boolean',
        'array',
        'object',
      ]);
    });
  });
});
