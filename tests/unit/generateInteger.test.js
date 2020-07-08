const _ = require('lodash');
const { lib } = require('../..');

describe('generateInteger', function () {
  it('always returns an integer', function () {
    expect(_.times(10, lib.generateInteger)).to.all.satisfy(_.isInteger);
  });
});
