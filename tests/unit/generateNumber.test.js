const _ = require('lodash');
const { lib } = require('../..');

describe('generateNumber', function () {
  it('returns a number', function () {
    expect(lib.generateNumber()).to.be.a('number');
  });

  it('sometimes returns a decimal', function () {
    const results = _.times(10, lib.generateNumber);
    expect(results).to.include.something.that.satisfies(_.negate(_.isInteger));
  });

  it('sometimes returns an integer', function () {
    const results = _.times(10, lib.generateNumber);
    expect(results).to.include.something.that.satisfies(_.isInteger);
  });
});
