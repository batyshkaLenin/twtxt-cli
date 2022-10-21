const path = require("path");

module.exports = {
  automock: false,
  bail: 1,
  clearMocks: true,
  collectCoverage: true,
  testEnvironment: 'node',
  rootDir: path.join(__dirname, './'),
};
