const _ = require('lodash');
const { defaultMocker } = require('../../lib/mocker');

describe('generateString', function () {
  context('by default', function () {
    before(function () {
      this.results = _.times(50, () => defaultMocker.generateString({
        type: 'string',
        minLength: 5,
        maxLength: 10,
      }));
    });

    it('always returns a string', function () {
      expect(this.results).to.all.satisfy(_.isString);
    });

    it('never returns a string outside the allowed range', function () {
      expect(this.results).to.all.satisfy((string) => string.length >= 5 && string.length <= 10);
    });

    it('sometimes returns a string of the min length', function () {
      expect(this.results).to.include.something.that.satisfies((string) => string.length === 5);
    });

    it('sometimes returns a string of the max length', function () {
      expect(this.results).to.include.something.that.satisfies((string) => string.length === 10);
    });

    it('sometimes returns a string between the min and max length', function () {
      expect(this.results).to.include.something.that.satisfies((string) => string.length > 5 && string.length < 10);
    });
  });

  context('when minLength and maxLength conflict', function () {
    it('throws an error', function () {
      const testFn = () => {
        defaultMocker.generateString({
          type: 'string',
          minLength: 10,
          maxLength: 3,
        });
      };

      expect(testFn).to.throw('Cannot generate data for conflicting "minLength" and "maxLength"');
    });
  });
});
