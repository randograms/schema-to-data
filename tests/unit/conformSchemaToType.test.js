const { defaultMocker } = require('../../lib/mocker');

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
        expect(defaultMocker.conformSchemaToType(singleTypedSchema)).to.eql({
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

        this.result = defaultMocker.conformSchemaToType(typedSchema);
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
          expect(defaultMocker.conformSchemaToType(singleTypedSchema)).to.eql({
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

          this.result = defaultMocker.conformSchemaToType(schema);
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

          this.result = defaultMocker.conformSchemaToType(schema);
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

          this.result = defaultMocker.conformSchemaToType(schema);
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

  context('with a singleTypedSchema with a malformed type', function () {
    it('returns a schema with just the type', function () {
      const singleTypedSchema = generateValidTestSchema({
        type: 'whoops',
        unsupportedSchemaKey: Symbol('unsupportedSchemaKey'),
      });

      const result = defaultMocker.conformSchemaToType(singleTypedSchema);
      expect(result).to.not.equal(singleTypedSchema);
      expect(result).to.eql({ type: 'whoops' });
    });
  });
});
