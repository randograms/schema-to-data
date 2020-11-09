const { expect } = require('chai');
const _ = require('lodash');
const { Mocker, defaultMocker } = require('../../../lib/mocker');

module.exports.setupCustomMocker = (options) => {
  before(function () {
    const {
      onUnknownPattern,
      ...defaults
    } = options;
    this.mocker = new Mocker(options);

    _.keys(defaults).forEach((defaultName) => {
      expect(this.mocker.DEFAULTS[defaultName], defaultName).to.not.equal(defaultMocker.DEFAULTS[defaultName]);
    });

    expect(this.mocker.OPTIONS.onUnknownPattern, 'onUnknownPattern')
      .to.not.equal(defaultMocker.OPTIONS.onUnknownPattern);
  });
};
