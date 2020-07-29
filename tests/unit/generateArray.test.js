const { defaultMocker } = require('../../lib/mocker');

const sandbox = sinon.createSandbox();

const generateValidTestSchema = ({ items = [] } = {}) => ({ items });

describe('generateArray', function () {
  context('when "items" is empty', function () {
    it('returns an empty array', function () {
      const schema = generateValidTestSchema();
      expect(defaultMocker.generateArray(schema)).to.eql([]);
    });
  });

  context('when "items" is not empty', function () {
    before(function () {
      this.itemSchema1 = Symbol('itemSchema1');
      this.itemSchema2 = Symbol('itemSchema2');
      this.itemSchema3 = Symbol('itemSchema3');

      this.generatedData1 = Symbol('generatedData1');
      this.generatedData2 = Symbol('generatedData2');
      this.generatedData3 = Symbol('generatedData3');

      const stub = sandbox.stub(defaultMocker, 'generateData');
      stub.withArgs(this.itemSchema1).returns(this.generatedData1);
      stub.withArgs(this.itemSchema2).returns(this.generatedData2);
      stub.withArgs(this.itemSchema3).returns(this.generatedData3);

      const schema = generateValidTestSchema({
        items: [
          this.itemSchema1,
          this.itemSchema2,
          this.itemSchema3,
        ],
      });

      this.result = defaultMocker.generateArray(schema);
    });
    after(sandbox.restore);

    it('returns an array with generated data for each item', function () {
      expect(this.result).to.eql([this.generatedData1, this.generatedData2, this.generatedData3]);
    });
  });
});
