const { defaultMocker } = require('../../lib/mocker');

const sandbox = sinon.createSandbox();

describe('generateArray', function () {
  context('when "items" is empty', function () {
    it('returns an empty array', function () {
      const conformedSchema = {
        type: 'array',
        items: [],
      };
      const result = testUnit(defaultMocker, 'generateArray', conformedSchema);

      expect(result).to.eql([]);
    });
  });

  context('when "items" is not empty', function () {
    before(function () {
      this.itemSchema1 = { referenceId: 'itemSchema1' };
      this.itemSchema2 = { referenceId: 'itemSchema2' };
      this.itemSchema3 = { referenceId: 'itemSchema3' };

      this.generatedData1 = Symbol('generatedData1');
      this.generatedData2 = Symbol('generatedData2');
      this.generatedData3 = Symbol('generatedData3');

      const stub = sandbox.stub(defaultMocker, 'generateData');
      stub.withArgs(this.itemSchema1).returns(this.generatedData1);
      stub.withArgs(this.itemSchema2).returns(this.generatedData2);
      stub.withArgs(this.itemSchema3).returns(this.generatedData3);

      const conformedSchema = {
        type: 'array',
        items: [
          this.itemSchema1,
          this.itemSchema2,
          this.itemSchema3,
        ],
      };

      this.result = testUnit(defaultMocker, 'generateArray', conformedSchema);
    });
    after(sandbox.restore);

    it('returns an array with generated data for each item', function () {
      expect(this.result).to.eql([this.generatedData1, this.generatedData2, this.generatedData3]);
    });
  });
});
