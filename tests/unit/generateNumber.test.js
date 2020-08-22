const _ = require('lodash');
const { defaultMocker } = require('../../lib/mocker');

describe('generateNumber', function () {
  context('when type is "decimal"', function () {
    before(function () {
      this.results = _.times(10, () => testUnit(
        defaultMocker,
        'generateNumber',
        {
          type: 'decimal',
          minimum: -10,
          maximum: 10,
        },
      ));
    });

    it('always returns a number', function () {
      expect(this.results).to.all.satisfy(_.isNumber);
    });

    it('always returns a decimal', function () {
      expect(this.results).to.all.satisfy(_.negate(_.isInteger));
    });

    it('always returns a number between the minimum and maximum', function () {
      expect(this.results).to.all.satisfy((data) => data >= -10 && data <= 10);
    });
  });

  context('when type is "integer"', function () {
    before(function () {
      this.results = _.times(10, () => testUnit(
        defaultMocker,
        'generateNumber',
        {
          type: 'integer',
          minimum: -10,
          maximum: 10,
        },
      ));
    });

    it('always returns a number', function () {
      expect(this.results).to.all.satisfy(_.isNumber);
    });

    it('always returns an integer', function () {
      expect(this.results).to.all.satisfy(_.isInteger);
    });

    it('always returns a number between the minimum and maximum', function () {
      expect(this.results).to.all.satisfy((data) => data >= -10 && data <= 10);
    });
  });
});
