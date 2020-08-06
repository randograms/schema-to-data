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

    describe('array default errors', function () {
      context('when "arrayItemsRange" is less than zero', function () {
        it('throws an error', function () {
          const testFn = () => {
            new Mocker({ arrayItemsRange: -1 });
          };

          expect(testFn).to.throw('"arrayItemsRange" must be a non-negative integer');
        });
      });

      context('when "maxExtraAdditionalItems" is less than zero', function () {
        it('throws an error', function () {
          const testFn = () => {
            new Mocker({ maxExtraAdditionalItems: -1 });
          };

          expect(testFn).to.throw('"maxExtraAdditionalItems" must be a non-negative integer');
        });
      });

      context('when "minArrayItems" is less than zero', function () {
        it('throws an error', function () {
          const testFn = () => {
            new Mocker({ minArrayItems: -1 });
          };

          expect(testFn).to.throw('"minArrayItems" must be a non-negative integer');
        });
      });
    });

    describe('number default errors', function () {
      context('when "minNumber" is not a number', function () {
        it('throws an error', function () {
          const testFn = () => {
            new Mocker({ minNumber: 'a' });
          };

          expect(testFn).to.throw('"minNumber" must be a number');
        });
      });

      context('when "maxNumber" is not a number', function () {
        it('throws an error', function () {
          const testFn = () => {
            new Mocker({ maxNumber: 'a' });
          };

          expect(testFn).to.throw('"maxNumber" must be a number');
        });
      });

      context('when "maxNumber" and "minNumber" are provided and they conflict', function () {
        it('throws an error', function () {
          const testFn = () => {
            new Mocker({ minNumber: 1, maxNumber: -1 });
          };

          expect(testFn).to.throw('"minNumber" must be less than or equal to "maxNumber"');
        });
      });

      context('when only "maxNumber" is provided and it conflicts with the default "minNumber"', function () {
        it('throws an error', function () {
          const testFn = () => {
            new Mocker({ maxNumber: -Number.MAX_SAFE_INTEGER });
          };

          expect(testFn).to.throw('"minNumber" must be less than or equal to "maxNumber"');
        });
      });

      context('when only "minNumber" is provided and it conflicts with the default "maxNumber"', function () {
        it('throws an error', function () {
          const testFn = () => {
            new Mocker({ minNumber: Number.MAX_SAFE_INTEGER });
          };

          expect(testFn).to.throw('"minNumber" must be less than or equal to "maxNumber"');
        });
      });
    });

    describe('object default errors', function () {
      context('when "maxExtraAdditionalProperties" is less than zero', function () {
        it('throws an error', function () {
          const testFn = () => {
            new Mocker({ maxExtraAdditionalProperties: -1 });
          };

          expect(testFn).to.throw('"maxExtraAdditionalProperties" must be a non-negative integer');
        });
      });

      context('when "maxExtraAdditionalProperties" is not an integer', function () {
        it('throws an error', function () {
          const testFn = () => {
            new Mocker({ maxExtraAdditionalProperties: 1.1 });
          };

          expect(testFn).to.throw('"maxExtraAdditionalProperties" must be a non-negative integer');
        });
      });

      context('when "minObjectProperties" is less than zero', function () {
        it('throws an error', function () {
          const testFn = () => {
            new Mocker({ minObjectProperties: -1 });
          };

          expect(testFn).to.throw('"minObjectProperties" must be a non-negative integer');
        });
      });

      context('when "minObjectProperties" is not an integer', function () {
        it('throws an error', function () {
          const testFn = () => {
            new Mocker({ minObjectProperties: 1.1 });
          };

          expect(testFn).to.throw('"minObjectProperties" must be a non-negative integer');
        });
      });

      context('when "optionalPropertyPrioritization" is not a number', function () {
        it('throws an error', function () {
          const testFn = () => {
            new Mocker({ optionalPropertyPrioritization: 'test' });
          };

          expect(testFn).to.throw('"optionalPropertyPrioritization" must be a number in the range [0, 1]');
        });
      });

      context('when "optionalPropertyPrioritization" is less than zero', function () {
        it('throws an error', function () {
          const testFn = () => {
            new Mocker({ optionalPropertyPrioritization: -0.1 });
          };

          expect(testFn).to.throw('"optionalPropertyPrioritization" must be a number in the range [0, 1]');
        });
      });

      context('when "optionalPropertyPrioritization" is greater than 1', function () {
        it('throws an error', function () {
          const testFn = () => {
            new Mocker({ optionalPropertyPrioritization: 1.1 });
          };

          expect(testFn).to.throw('"optionalPropertyPrioritization" must be a number in the range [0, 1]');
        });
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
