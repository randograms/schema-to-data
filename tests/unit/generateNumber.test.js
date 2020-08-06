const _ = require('lodash');
const { defaultMocker } = require('../../lib/mocker');

const generateValidTestSchema = ({ type } = {}) => ({ type });

describe('generateNumber', function () {
  context('when type is "decimal"', function () {
    before(function () {
      const schema = generateValidTestSchema({ type: 'decimal' });

      this.results = _.times(10, () => defaultMocker.generateNumber(schema));
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

      this.results = _.times(10, () => defaultMocker.generateNumber(schema));
    });

    it('always returns a number', function () {
      expect(this.results).to.all.satisfy(_.isNumber);
    });

    it('always returns an integer', function () {
      expect(this.results).to.all.satisfy(_.isInteger);
    });
  });
});
