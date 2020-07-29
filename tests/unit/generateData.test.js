const { defaultMocker } = require('../../lib/mocker');

describe('generateData', function () {
  context('with a schema with an undefined type', function () {
    it('throws an error', function () {
      const testFn = () => {
        defaultMocker.generateData({ type: undefined });
      };

      expect(testFn).to.throw('Expected schema to have a known type but got "undefined"');
    });
  });

  context('with a schema with an non-string type', function () {
    it('throws an error', function () {
      const testFn = () => {
        defaultMocker.generateData({ type: 87 });
      };

      expect(testFn).to.throw('Expected schema to have a known type but got "87"');
    });
  });

  context('with a schema with an unknown type', function () {
    it('throws an error', function () {
      const testFn = () => {
        defaultMocker.generateData({ type: 'whoops' });
      };

      expect(testFn).to.throw('Expected schema to have a known type but got "whoops"');
    });
  });
});
