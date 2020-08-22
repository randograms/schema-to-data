const { defaultMocker } = require('../../lib/mocker');

describe('generateData', function () {
  context('with a null conformed schema', function () {
    it('returns null', function () {
      const data = testUnit(defaultMocker, 'generateData', { type: 'null' });

      expect(data).to.be.null;
    });
  });
});
