const _ = require('lodash');
const { Mocker, defaultMocker } = require('../../../lib/mocker');

module.exports.setupCustomMocker = (options) => {
  before(function () {
    this.mocker = new Mocker(options);

    _.keys(options).forEach((option) => {
      expect(this.mocker.DEFAULTS[option]).to.not.equal(defaultMocker.DEFAULTS[option]);
    });
  });
};
