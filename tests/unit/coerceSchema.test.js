const { defaultMocker } = require('../../lib/mocker');

describe('coerceSchema', function () {
  context('with a "false" literal schema', function () {
    it('throws an error', function () {
      const testFn = () => {
        testUnit(defaultMocker, 'coerceSchema', false);
      };

      expect(testFn).to.throw('Cannot generate data for a "false" literal schema');
    });
  });
});
