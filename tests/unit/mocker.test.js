const { Mocker } = require('../../lib/mocker');

describe('Mocker', function () {
  // regression
  context('without options', function () {
    it('returns a Mocker instance (and doesnt throw an error)', function () {
      expect(new Mocker()).to.be.an.instanceof(Mocker);
    });
  });

  context('with unsupported options', function () {
    it('throws an error', function () {
      const testFn = () => {
        new Mocker({ badOptionA: true, badOptionB: true }); // eslint-disable-line no-new
      };

      expect(testFn).to.throw('Unsupported option(s) "badOptionA,badOptionB"');
    });
  });
});
