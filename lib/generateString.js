const _ = require('lodash');
const faker = require('faker');
const uuid = require('uuid');
const { randexp } = require('randexp');

const generateRandomDate = () => {
  switch (_.random(1, 3)) {
    case 1: return faker.date.past().toISOString();
    case 2: return faker.date.future().toISOString();
    default: return faker.date.recent().toISOString();
  }
};

const formatFunctions = {
  date: () => generateRandomDate().slice(0, 10),
  'date-time': generateRandomDate,
  email: faker.internet.exampleEmail,
  ipv4: faker.internet.ip,
  ipv6: faker.internet.ipv6,
  time: () => generateRandomDate().slice(11, 19),
  uuid: uuid.v4,
};

// wrapper function is for testing purposes
const generateStringFromPattern = (pattern) => randexp(pattern);

const generateString = function (stringSchema) {
  const {
    format,
    pattern,
    minLength,
    maxLength,
  } = stringSchema;

  if (format !== null) {
    return formatFunctions[format]();
  }

  if (pattern !== null) {
    return this.generateStringFromPattern(pattern);
  }

  const stringLength = _.random(minLength, maxLength);

  let generatedLength = 0;
  const randomWords = [];

  while (generatedLength < stringLength) {
    let randomWord = faker.lorem.word();
    generatedLength += randomWord.length;

    if (generatedLength > stringLength) {
      const numCharsToRemove = generatedLength - stringLength;
      const numCharsToKeep = randomWord.length - numCharsToRemove;

      randomWord = randomWord.substr(0, numCharsToKeep);
      generatedLength -= numCharsToRemove;
    }

    randomWords.push(randomWord);
  }

  const randomString = randomWords.join('');
  return randomString;
};

module.exports = {
  generateStringFromPattern,
  generateString,
};
