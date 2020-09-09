const _ = require('lodash');
const { defaultMocker } = require('../../lib/mocker');

describe('generateBoolean', function () {
  before(function () {
    this.results = _.times(10, () => testUnit(defaultMocker, 'generateBoolean', { type: 'boolean', enum: null }));
  });

  it('always returns a boolean', function () {
    expect(this.results).to.all.satisfy(_.isBoolean);
  });

  it('sometimes returns true', function () {
    expect(this.results).to.include.something.that.equals(true);
  });

  it('sometimes returns false', function () {
    expect(this.results).to.include.something.that.equals(false);
  });
});
