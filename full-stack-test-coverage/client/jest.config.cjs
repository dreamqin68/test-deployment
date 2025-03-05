module.exports = {
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "^@/lib/api-client$": "<rootDir>/__mocks__/api-client.js",
    "^@/lib/constants$": "<rootDir>/__mocks__/constants.js", // specific mapping first
    "^@/(.*)$": "<rootDir>/src/$1", // generic mapping after
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.cjs",
  },
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js", "jsx", "json", "node"],
};
