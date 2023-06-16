const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
  clearMocks: true,
  roots: ['<rootDir>/__tests__/'],
  // preset: 'ts-jest',
  preset: '@shelf/jest-mongodb',
  transform: tsjPreset.transform,
};
