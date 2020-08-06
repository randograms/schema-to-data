const { defaultMocker } = require('../../lib/mocker');
const { setupCustomMocker } = require('./helpers/setupCustomMocker');

const generateValidTestSchema = ({ ...keywords } = {}) => ({
  ...keywords,
  type: 'string',
});

describe('getConformedStringKeywords', function () {
  context('by default', function () {
    it('returns relevant keys with default values', function () {
      const singleTypedSchema = generateValidTestSchema();
      expect(defaultMocker.getConformedStringKeywords(singleTypedSchema)).to.eql({
        minLength: 0,
        maxLength: 500,
      });
    });
  });

  context('with a custom default "minStringLength"', function () {
    setupCustomMocker({ minStringLength: 30 });

    it('returns relevant keys with custom default values', function () {
      const singleTypedSchema = generateValidTestSchema();
      expect(this.mocker.getConformedStringKeywords(singleTypedSchema)).to.eql({
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
      const singleTypedSchema = generateValidTestSchema();
      expect(this.mocker.getConformedStringKeywords(singleTypedSchema)).to.eql({
        minLength: 0,
        maxLength: 80,
      });
    });
  });

  context('with "minLength" and a custom default "stringLengthRange"', function () {
    setupCustomMocker({ stringLengthRange: 20 });

    it('returns the "minLength" and an adjusted "maxLength"', function () {
      const singleTypedSchema = generateValidTestSchema({
        minLength: 70,
      });
      expect(this.mocker.getConformedStringKeywords(singleTypedSchema)).to.eql({
        minLength: 70,
        maxLength: 90,
      });
    });
  });

  context('with "maxLength"', function () {
    setupCustomMocker({ minStringLength: 1 });

    it('returns the default "minStringLength" and the "maxLength', function () {
      const singleTypedSchema = generateValidTestSchema({
        maxLength: 60,
      });
      expect(this.mocker.getConformedStringKeywords(singleTypedSchema)).to.eql({
        minLength: 1,
        maxLength: 60,
      });
    });
  });

  context('when "maxLength" is less than "minStringLength"', function () {
    setupCustomMocker({ minStringLength: 10 });

    it('adjusts the minLength', function () {
      const singleTypedSchema = generateValidTestSchema({
        maxLength: 4,
      });
      expect(this.mocker.getConformedStringKeywords(singleTypedSchema)).to.eql({
        minLength: 4,
        maxLength: 4,
      });
    });
  });

  context('when "minLength" and "maxLength" conflict', function () {
    it('throws an error', function () {
      const singleTypedSchema = generateValidTestSchema({
        minLength: 10,
        maxLength: 3,
      });

      const testFn = () => {
        defaultMocker.getConformedStringKeywords(singleTypedSchema);
      };

      expect(testFn).to.throw('Cannot generate data for conflicting "minLength" and "maxLength"');
    });
  });
});
