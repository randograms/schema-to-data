const { lib } = require('../..');

describe('generateData', function () {
  context('with a schema with an unknown type', function () {
    it('throws an error', function () {
      const testFn = () => {
        lib.generateData({ type: 'whoops' });
      };

      expect(testFn).to.throw('Expected schema to have a known type but got "whoops"');
    });
  });
});
