module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(t|j)sx?$': ['babel-jest', { configFile: './.babelrc' }],
  },
  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy',
    '\\.(svg)$': '<rootDir>/__tests__/svgMock.js'
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom']
};
