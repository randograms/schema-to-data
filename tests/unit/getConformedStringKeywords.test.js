const { defaultMocker } = require('../../lib/mocker');

const generateValidTestSchema = ({ ...keywords } = {}) => ({
  ...keywords,
  type: 'string',
});

describe('getConformedStringKeywords', function () {
  context('by default', function () {
    it('returns relevant keys', function () {
      const singleTypedSchema = generateValidTestSchema();
      expect(defaultMocker.getConformedStringKeywords(singleTypedSchema)).to.eql({
        minLength: 0,
        maxLength: 20,
      });
    });
  });

  context('when minLength exceeds the default maxLength', function () {
    before(function () {
      const singleTypedSchema = generateValidTestSchema({
        minLength: 1000,
      });

      this.result = defaultMocker.conformSchemaToType(singleTypedSchema);
    });

    it('adjusts the maxLength', function () {
      expect(this.result).to.be.like({
        minLength: 1000,
        maxLength: 1020,
      });
    });
  });
});
