export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/data/**',
    '!src/router/**',
    '!src/wss/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  maxWorkers: 1,
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
  moduleNameMapper: {
    '^bcrypt$': '<rootDir>/__mocks__/bcrypt.js'
  }
};
