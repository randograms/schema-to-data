const sinon = require('sinon');
const { expect } = require('chai')
  .use(require('chai-things'))
  .use(require('sinon-chai'));

global.expect = expect;
global.sinon = sinon;
