const { defaultMocker } = require('../../lib/mocker');

const sandbox = sinon.createSandbox();

const generateValidTestSchema = ({ properties = {}, required = [] } = {}) => ({ properties, required });

describe('generateObject', function () {
  context('with a schema without property schemas', function () {
    it('returns an empty object', function () {
      const schema = generateValidTestSchema({
        properties: {},
      });
      expect(defaultMocker.generateObject(schema)).to.eql({});
    });
  });

  context('with a schema with coerced property schemas', function () {
    before(function () {
      this.propertySchema1 = Symbol('propertySchema1');
      this.propertySchema2 = Symbol('propertySchema2');

      this.generatedData1 = Symbol('generatedData1');
      this.generatedData2 = Symbol('generatedData2');

      const stub = sandbox.stub(defaultMocker, 'generateData');
      stub.withArgs(this.propertySchema1).returns(this.generatedData1);
      stub.withArgs(this.propertySchema2).returns(this.generatedData2);

      const schema = generateValidTestSchema({
        properties: {
          property1: this.propertySchema1,
          property2: this.propertySchema2,
        },
      });

      this.result = defaultMocker.generateObject(schema);
    });

    it('returns an object with generated properties', function () {
      expect(this.result).to.eql({
        property1: this.generatedData1,
        property2: this.generatedData2,
      });
    });
  });
});
