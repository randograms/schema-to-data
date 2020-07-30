const _ = require('lodash');
const { defaultMocker } = require('../../lib/mocker');

describe('generateBoolean', function () {
  it('returns a boolean', function () {
    expect(defaultMocker.generateBoolean()).to.be.a('boolean');
  });

  it('sometimes returns true', function () {
    const results = _.times(10, defaultMocker.generateBoolean);
    expect(results).to.include.something.that.equals(true);
  });

  it('sometimes returns false', function () {
    const results = _.times(10, defaultMocker.generateBoolean);
    expect(results).to.include.something.that.equals(false);
  });
});
