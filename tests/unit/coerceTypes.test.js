const { defaultMocker } = require('../../lib/mocker');

describe('coerceTypes', function () {
  const additionalSchemaKeys = Symbol('additionalSchemaKeys');

  const buildSetupResultForSchemaWithType = (type) => function () {
    this.schema = {
      type,
      additionalSchemaKeys,
    };

    this.result = testUnit(defaultMocker, 'coerceTypes', this.schema);
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
        'decimal',
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

  context('when the schema has a "number" type', function () {
    before(buildSetupResultForSchemaWithType('number'));

    itReturnsACopyOfTheSchema();
    itReturnsASchemaWithATypeArray();

    it('returns a schema with a "decimal" and "integer" data type', function () {
      expect(this.result.type).to.eql(['decimal', 'integer']);
    });
  });

  context('when the schema has a type array', function () {
    before(buildSetupResultForSchemaWithType(['array', 'boolean']));

    itReturnsACopyOfTheSchema();
    itReturnsASchemaWithATypeArray();

    it('returns a schema with a copy of the data types', function () {
      expect(this.result.type).to.eql(['array', 'boolean']);
      expect(this.result.type).to.not.equal(this.schema.type);
    });
  });

  context('when the schema has a type array that includes "number"', function () {
    before(buildSetupResultForSchemaWithType(['number', 'boolean']));

    itReturnsACopyOfTheSchema();
    itReturnsASchemaWithATypeArray();

    it('returns a schema with a copy of the expanded data types', function () {
      expect(this.result.type).to.eql(['decimal', 'integer', 'boolean']);
      expect(this.result.type).to.not.equal(this.schema.type);
    });
  });

  context('when the schema has a type array that includes "number" and "integer"', function () {
    before(buildSetupResultForSchemaWithType(['integer', 'number']));

    itReturnsACopyOfTheSchema();
    itReturnsASchemaWithATypeArray();

    it('returns a schema with a copy of the unique expanded types', function () {
      expect(this.result.type).to.eql(['integer', 'decimal']);
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
        'decimal',
        'integer',
        'boolean',
        'array',
        'object',
      ]);
    });
  });

  context('when the schemas type field is an invalid string type', function () {
    before(buildSetupResultForSchemaWithType('whoops'));

    itReturnsACopyOfTheSchema();
    itReturnsASchemaWithATypeArray();

    it('returns a schema with all data types', function () {
      expect(this.result.type).to.eql([
        'null',
        'string',
        'decimal',
        'integer',
        'boolean',
        'array',
        'object',
      ]);
    });
  });

  context('when the schemas type field is an array of invalid values', function () {
    before(buildSetupResultForSchemaWithType(['whoops1', false, 3]));

    itReturnsACopyOfTheSchema();
    itReturnsASchemaWithATypeArray();

    it('returns a schema with all data types', function () {
      expect(this.result.type).to.eql([
        'null',
        'string',
        'decimal',
        'integer',
        'boolean',
        'array',
        'object',
      ]);
    });
  });

  context('when the schemas type field is an array with some valid and invalid values', function () {
    before(buildSetupResultForSchemaWithType(['string', 'whoops1', false, 'array', 3, 'object']));

    itReturnsACopyOfTheSchema();
    itReturnsASchemaWithATypeArray();

    it('returns a schema with the subset of valid types', function () {
      expect(this.result.type).to.eql([
        'string',
        'array',
        'object',
      ]);
    });
  });

  context('when the schemas type field is an empty array', function () {
    before(buildSetupResultForSchemaWithType([]));

    itReturnsACopyOfTheSchema();
    itReturnsASchemaWithATypeArray();

    it('returns a schema with all data types', function () {
      expect(this.result.type).to.eql([
        'null',
        'string',
        'decimal',
        'integer',
        'boolean',
        'array',
        'object',
      ]);
    });
  });
});
