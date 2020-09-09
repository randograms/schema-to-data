const _ = require('lodash');
const { defaultMocker } = require('../../lib/mocker');

const sandbox = sinon.createSandbox();

describe('conformSchemaToType', function () {
  before(function () {
    sandbox.stub(defaultMocker, 'coerceSchema').returns({ referenceId: 'mock coerced schema' });
  });
  after(sandbox.restore);

  [
    ['array', [[]]],
    ['boolean', [true, false]],
    ['decimal', [1.1, 1]],
    ['integer', [1]],
    ['null', [null]],
    ['object', [{}]],
    ['string', ['abc']],
  ].forEach(([type, expectedFilteredEnum]) => {
    context(`with a singleTypedSchema with just a type keyword of "${type}"`, function () {
      before(function () {
        this.singleTypedSchema = {
          type,
          unsupportedSchemaKey: Symbol('unsupportedSchemaKey'),
        };

        this.result = testUnit(defaultMocker, 'conformSchemaToType', this.singleTypedSchema);
        this.typeAgnosticResult = _.omit(this.result, [
          'items',
          'maximum',
          'minimum',
          'properties',
          'format',
          'maxLength',
          'minLength',
          'pattern',
        ]);
      });

      it('returns a copy of the schema', function () {
        expect(this.result).to.not.equal(this.singleTypedSchema);
      });

      it('returns a schema with default "type", "const" and "enum" values', function () {
        expect(this.typeAgnosticResult).to.eql({
          type,
          const: undefined,
          enum: null,
        });
      });
    });

    context(`with a singleTypedSchema with type "${type}" and "const"`, function () {
      before(function () {
        this.singleTypedSchema = {
          type,
          const: 'abc',
          unsupportedSchemaKey: Symbol('unsupportedSchemaKey'),
        };

        const result = testUnit(defaultMocker, 'conformSchemaToType', this.singleTypedSchema);
        this.typeAgnosticResult = _.omit(result, [
          'items',
          'maximum',
          'minimum',
          'properties',
          'format',
          'maxLength',
          'minLength',
          'pattern',
        ]);
      });

      it('returns a schema with the "const"', function () {
        expect(this.typeAgnosticResult).to.eql({
          type,
          const: 'abc',
          enum: null,
        });
      });
    });

    context(`with a singleTypedSchema with type "${type}" and "enum"`, function () {
      before(function () {
        this.singleTypedSchema = {
          type,
          enum: [
            [],
            true,
            false,
            1.1,
            1,
            null,
            {},
            'abc',
          ],
          unsupportedSchemaKey: Symbol('unsupportedSchemaKey'),
        };

        const result = testUnit(defaultMocker, 'conformSchemaToType', this.singleTypedSchema);
        this.typeAgnosticResult = _.omit(result, [
          'items',
          'maximum',
          'minimum',
          'properties',
          'format',
          'maxLength',
          'minLength',
          'pattern',
        ]);
      });

      it('returns a schema with a filtered "enum"', function () {
        expect(this.typeAgnosticResult).to.eql({
          type,
          const: undefined,
          enum: expectedFilteredEnum,
        });
      });
    });
  });
});
