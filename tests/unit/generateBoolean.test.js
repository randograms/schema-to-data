const _ = require('lodash');
const { lib } = require('../..');

describe('generateBoolean', function () {
  it('returns a boolean', function () {
    expect(lib.generateBoolean()).to.be.a('boolean');
  });

  it('sometimes returns true', function () {
    const results = _.times(10, lib.generateBoolean);
    expect(results).to.include.something.that.equals(true);
  });

  it('sometimes returns false', function () {
    const results = _.times(10, lib.generateBoolean);
    expect(results).to.include.something.that.equals(false);
  });
});
