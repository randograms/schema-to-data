const { Mocker, defaultMocker } = require('../../lib/mocker');

describe('mocker', function () {
  describe('Mocker', function () {
    context('with unsupported options', function () {
      it('throws an error', function () {
        const testFn = () => {
          new Mocker({ badOptionA: true, badOptionB: true }); // eslint-disable-line no-new
        };

        expect(testFn).to.throw('Unsupported option(s) "badOptionA,badOptionB"');
      });
    });
  });

  describe('defaultMocker', function () {
    it('is a Mocker', function () {
      expect(defaultMocker).to.be.an.instanceOf(Mocker);
    });
  });
});
