const { lib } = require('../..');

describe('generateString', function () {
  it('returns a string', function () {
    expect(lib.generateString()).to.be.a('string');
  });
});
