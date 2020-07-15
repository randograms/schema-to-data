const _ = require('lodash');
const { lib } = require('../..');

const generateValidTestSchema = ({ type } = {}) => ({ type });

describe('generateNumber', function () {
  context('when type is "decimal"', function () {
    before(function () {
      const schema = generateValidTestSchema({ type: 'decimal' });

      this.results = _.times(10, () => lib.generateNumber(schema));
    });

    it('always returns a number', function () {
      expect(this.results).to.all.satisfy(_.isNumber);
    });

    it('always returns a decimal', function () {
      expect(this.results).to.all.satisfy(_.negate(_.isInteger));
    });
  });

  context('when type is "integer"', function () {
    before(function () {
      const schema = generateValidTestSchema({ type: 'integer' });

      this.results = _.times(10, () => lib.generateNumber(schema));
    });

    it('always returns a number', function () {
      expect(this.results).to.all.satisfy(_.isNumber);
    });

    it('always returns an integer', function () {
      expect(this.results).to.all.satisfy(_.isInteger);
    });
  });

  context('when minimum and maximum conflict', function () {
    it('throws an error', function () {
      const testFn = () => {
        lib.generateNumber({
          type: 'decimal',
          minimum: 10,
          maximum: 9,
        });
      };

      expect(testFn).to.throw('Cannot generate data for conflicting "minimum" and "maximum"');
    });
  });
});
