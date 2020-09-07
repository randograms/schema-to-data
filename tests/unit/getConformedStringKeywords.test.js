const { defaultMocker } = require('../../lib/mocker');
const { setupCustomMocker } = require('./helpers/setupCustomMocker');

describe('getConformedStringKeywords', function () {
  context('by default', function () {
    it('returns relevant keys with default values', function () {
      const singleTypedSchema = { type: 'string' };
      const conformedKeywords = testUnit(defaultMocker, 'getConformedStringKeywords', singleTypedSchema);
      expect(conformedKeywords).to.eql({
        format: null,
        minLength: 0,
        maxLength: 500,
      });
    });
  });

  context('with a custom default "minStringLength"', function () {
    setupCustomMocker({ minStringLength: 30 });

    it('returns relevant keys with custom default values', function () {
      const singleTypedSchema = { type: 'string' };
      const conformedKeywords = testUnit(this.mocker, 'getConformedStringKeywords', singleTypedSchema);
      expect(conformedKeywords).to.eql({
        format: null,
        minLength: 30,
        maxLength: 530,
      });
    });
  });

  context('with a custom default "stringLengthRange"', function () {
    setupCustomMocker({
      stringLengthRange: 80,
    });

    it('returns relevant keys with custom default values', function () {
      const singleTypedSchema = { type: 'string' };
      const conformedKeywords = testUnit(this.mocker, 'getConformedStringKeywords', singleTypedSchema);
      expect(conformedKeywords).to.eql({
        format: null,
        minLength: 0,
        maxLength: 80,
      });
    });
  });

  context('with "minLength" and a custom default "stringLengthRange"', function () {
    setupCustomMocker({ stringLengthRange: 20 });

    it('returns the "minLength" and an adjusted "maxLength"', function () {
      const singleTypedSchema = {
        type: 'string',
        minLength: 70,
      };
      const conformedKeywords = testUnit(this.mocker, 'getConformedStringKeywords', singleTypedSchema);
      expect(conformedKeywords).to.eql({
        format: null,
        minLength: 70,
        maxLength: 90,
      });
    });
  });

  context('with "maxLength"', function () {
    setupCustomMocker({ minStringLength: 1 });

    it('returns the default "minStringLength" and the "maxLength', function () {
      const singleTypedSchema = {
        type: 'string',
        maxLength: 60,
      };
      const conformedKeywords = testUnit(this.mocker, 'getConformedStringKeywords', singleTypedSchema);
      expect(conformedKeywords).to.eql({
        format: null,
        minLength: 1,
        maxLength: 60,
      });
    });
  });

  context('when "maxLength" is less than "minStringLength"', function () {
    setupCustomMocker({ minStringLength: 10 });

    it('adjusts the minLength', function () {
      const singleTypedSchema = {
        type: 'string',
        maxLength: 4,
      };
      const conformedKeywords = testUnit(this.mocker, 'getConformedStringKeywords', singleTypedSchema);
      expect(conformedKeywords).to.eql({
        format: null,
        minLength: 4,
        maxLength: 4,
      });
    });
  });

  context('when "minLength" and "maxLength" conflict', function () {
    it('throws an error', function () {
      const singleTypedSchema = {
        type: 'string',
        minLength: 10,
        maxLength: 3,
      };

      const testFn = () => {
        testUnit(defaultMocker, 'getConformedStringKeywords', singleTypedSchema);
      };

      expect(testFn).to.throw('Cannot generate data for conflicting "minLength" and "maxLength"');
    });
  });

  context('with a supported format', function () {
    it('preserves the format', function () {
      const singleTypedSchema = {
        type: 'string',
        format: 'uuid',
      };
      const conformedKeywords = testUnit(defaultMocker, 'getConformedStringKeywords', singleTypedSchema);
      expect(conformedKeywords).to.eql({
        format: 'uuid',
        minLength: 0,
        maxLength: 500,
      });
    });
  });

  context('with an unsupported format', function () {
    it('ignores the format', function () {
      const singleTypedSchema = {
        type: 'string',
        format: 'abcd',
      };
      const conformedKeywords = testUnit(defaultMocker, 'getConformedStringKeywords', singleTypedSchema);
      expect(conformedKeywords).to.eql({
        format: null,
        minLength: 0,
        maxLength: 500,
      });
    });
  });
});
