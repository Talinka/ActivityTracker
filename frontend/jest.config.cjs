/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  rootDir: './',
  testMatch: ['**/?(*.)+(test|spec).ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(ts|js)$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }]
  },
  transformIgnorePatterns: ['node_modules/(?!(lit|lit-html|lit-element|@lit)/)']
};

module.exports = config;
