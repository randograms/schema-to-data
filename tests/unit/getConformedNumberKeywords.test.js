const { defaultMocker } = require('../../lib/mocker');

// TODO: enforce that type is either "decimal" or "integer"
const generateValidTestSchema = ({ ...keywords } = {}) => ({
  ...keywords,
});

describe('getConformedNumberKeywords', function () {
  const testCommonBehavior = (type) => {
    context('by default', function () {
      it('returns relevant keys', function () {
        const singleTypedSchema = generateValidTestSchema({ type });
        expect(defaultMocker.getConformedNumberKeywords(singleTypedSchema)).to.eql({
          minimum: -100000,
          maximum: 100000,
        });
      });
    });

    context('when "minimum" exceeds the default maximum', function () {
      before(function () {
        const singleTypedSchema = generateValidTestSchema({
          type,
          minimum: 200000,
        });

        this.result = defaultMocker.getConformedNumberKeywords(singleTypedSchema);
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
        const singleTypedSchema = generateValidTestSchema({
          type,
          maximum: -200000,
        });

        this.result = defaultMocker.getConformedNumberKeywords(singleTypedSchema);
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

        this.result = defaultMocker.getConformedNumberKeywords(schema);
      });

      it('adjusts them to be integers', function () {
        expect(this.result).to.eql({
          minimum: -5,
          maximum: 2,
        });
      });
    });
  });
});
