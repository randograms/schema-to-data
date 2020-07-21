const { lib } = require('../..');

describe('coerceSchema', function () {
  context('with a "false" literal schema', function () {
    it('throws an error', function () {
      const testFn = () => {
        lib.coerceSchema(false);
      };

      expect(testFn).to.throw('Cannot generate data for a "false" literal schema');
    });
  });
});
