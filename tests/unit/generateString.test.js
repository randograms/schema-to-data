const _ = require('lodash');
const { defaultMocker } = require('../../lib/mocker');

describe('generateString', function () {
  context('when format is null', function () {
    before(function () {
      this.results = _.times(50, () => testUnit(
        defaultMocker,
        'generateString',
        {
          type: 'string',
          format: null,
          minLength: 5,
          maxLength: 10,
        },
      ));
    });

    it('always returns a string', function () {
      expect(this.results).to.all.satisfy(_.isString);
    });

    it('always returns a string within the allowed range', function () {
      expect(this.results).to.all.satisfy((string) => string.length >= 5 && string.length <= 10);
    });

    it('sometimes returns a string of the min length', function () {
      expect(this.results).to.include.something.that.satisfies((string) => string.length === 5);
    });

    it('sometimes returns a string of the max length', function () {
      expect(this.results).to.include.something.that.satisfies((string) => string.length === 10);
    });

    it('sometimes returns a string between the min and max length', function () {
      expect(this.results).to.include.something.that.satisfies((string) => string.length > 5 && string.length < 10);
    });
  });

  const supportedFormats = [
    ['date', 'a date'],
    ['date-time', 'a date-timestamp'],
    ['email', 'an email'],
    ['ipv4', 'an ipv4'],
    ['ipv6', 'an ipv6'],
    ['time', 'a timestamp'],
    ['uuid', 'a uuid'],
  ];

  supportedFormats.forEach(([format, description]) => {
    context(`with a schema with the ${format} format`, function () {
      it(`ignores the min and max length and returns ${description}`, function () {
        const coercedSchema = {
          type: 'string',
          format,
          minLength: 1,
          maxLength: 2,
        };

        const result = testUnit(defaultMocker, 'generateString', coercedSchema);

        expect(result).to.be.jsonSchema({
          type: 'string',
          format,
        });
      });
    });
  });
});
