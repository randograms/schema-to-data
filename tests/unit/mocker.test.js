/* eslint-disable no-new */

const { Mocker, defaultMocker } = require('../../lib/mocker');

describe('mocker', function () {
  describe('Mocker', function () {
    context('with unsupported options', function () {
      it('throws an error', function () {
        const testFn = () => {
          new Mocker({ badOptionA: true, badOptionB: true });
        };

        expect(testFn).to.throw('Unsupported option(s) "badOptionA,badOptionB"');
      });
    });

    describe('string default errors', function () {
      context('when "minStringLength" is less than zero', function () {
        it('throws an error', function () {
          const testFn = () => {
            new Mocker({ minStringLength: -1 });
          };

          expect(testFn).to.throw('"minStringLength" must be a non-negative integer');
        });
      });

      context('when "minStringLength" is not an integer', function () {
        it('throws an error', function () {
          const testFn = () => {
            new Mocker({ minStringLength: 2.7 });
          };

          expect(testFn).to.throw('"minStringLength" must be a non-negative integer');
        });
      });

      context('when "stringLengthRange" is less than zero', function () {
        it('throws an error', function () {
          const testFn = () => {
            new Mocker({ stringLengthRange: -1 });
          };

          expect(testFn).to.throw('"stringLengthRange" must be a non-negative integer');
        });
      });

      context('when "stringLengthRange" is not an integer', function () {
        it('throws an error', function () {
          const testFn = () => {
            new Mocker({ stringLengthRange: 3.5 });
          };

          expect(testFn).to.throw('"stringLengthRange" must be a non-negative integer');
        });
      });
    });

    context('with multiple errors', function () {
      it('throws all errors', function () {
        const testFn = () => {
          new Mocker({ minStringLength: -1, badOptionA: true });
        };

        // eslint-disable-next-line max-len
        expect(testFn).to.throw('Error(s) setting up defaults: "minStringLength" must be a non-negative integer, Unsupported option(s) "badOptionA"');
      });
    });
  });

  describe('Mocker.extractSchemaToData', function () {
    before(function () {
      this.mocker = new Mocker();
      this.schemaToData = Mocker.extractSchemaToData(this.mocker);
    });

    it('returns a function', function () {
      expect(this.schemaToData).to.be.a('function');
    });

    it('returns something with a "getDefaults" function', function () {
      expect(this.schemaToData).to.have.property('getDefaults').that.is.a('function');
    });

    describe('getDefaults', function () {
      it('returns a copy of the mockers DEFAULTS object', function () {
        const defaults = this.schemaToData.getDefaults();
        expect(defaults).to.eql(this.mocker.DEFAULTS);
        expect(defaults).to.not.equal(this.mocker.DEFAULTS);
      });
    });
  });

  describe('defaultMocker', function () {
    it('is a Mocker', function () {
      expect(defaultMocker).to.be.an.instanceOf(Mocker);
    });
  });
});
