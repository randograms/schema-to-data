const { defaultMocker } = require('../../lib/mocker');
const { setupCustomMocker } = require('./helpers/setupCustomMocker');

describe('getConformedNumberKeywords', function () {
  const testCommonBehavior = (type) => {
    setupCustomMocker({
      minNumber: -10,
      maxNumber: 10,
    });

    context('by default', function () {
      it('returns relevant keys', function () {
        const singleTypedSchema = { type };
        const conformedKeywords = testUnit(this.mocker, 'getConformedNumberKeywords', singleTypedSchema);
        expect(conformedKeywords).to.eql({
          minimum: -10,
          maximum: 10,
        });
      });
    });

    context('with just "minimum"', function () {
      before(function () {
        const singleTypedSchema = {
          type,
          minimum: 2,
        };

        this.result = testUnit(this.mocker, 'getConformedNumberKeywords', singleTypedSchema);
      });

      it('uses the default "maxNumber"', function () {
        expect(this.result).to.be.like({
          minimum: 2,
          maximum: 10,
        });
      });
    });

    context('when "minimum" exceeds the default maximum', function () {
      before(function () {
        const singleTypedSchema = {
          type,
          minimum: 20,
        };

        this.result = testUnit(this.mocker, 'getConformedNumberKeywords', singleTypedSchema);
      });

      it('adjusts the maximum', function () {
        expect(this.result).to.be.like({
          minimum: 20,
          maximum: 20,
        });
      });
    });

    context('with just "maximum"', function () {
      before(function () {
        const singleTypedSchema = {
          type,
          maximum: 2,
        };

        this.result = testUnit(this.mocker, 'getConformedNumberKeywords', singleTypedSchema);
      });

      it('uses the default "minNumber"', function () {
        expect(this.result).to.be.like({
          minimum: -10,
          maximum: 2,
        });
      });
    });

    context('when "maximum" is less than the default minimum', function () {
      before(function () {
        const singleTypedSchema = {
          type,
          maximum: -20,
        };

        this.result = testUnit(this.mocker, 'getConformedNumberKeywords', singleTypedSchema);
      });

      it('adjusts the minimum', function () {
        expect(this.result).to.be.like({
          minimum: -20,
          maximum: -20,
        });
      });
    });

    context('when "minimum" and "maximum" conflict', function () {
      it('throws an error', function () {
        const testFn = () => {
          defaultMocker.getConformedNumberKeywords({
            minimum: 2,
            maximum: 1,
          });
        };

        expect(testFn).to.throw('Cannot generate data for conflicting "minimum" and "maximum"');
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
        const singleTypedSchema = {
          type: 'integer',
          minimum: -5.3,
          maximum: 2.1,
        };

        this.result = testUnit(defaultMocker, 'getConformedNumberKeywords', singleTypedSchema);
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
