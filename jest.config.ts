module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testTimeout: 20000,
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  moduleNameMapper: {
    '^root/prisma/(.*)$': '<rootDir>/prisma/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
};
