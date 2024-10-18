import type { Config } from "jest";
import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}"], // Coverage for src files only
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coverageReporters: ["json", "lcov", "text", "clover"], // Use different report formats
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // Setup jest-dom or other utilities
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"], // Test matching patterns
  resetMocks: true, // Optional: Resets all mocks before each test
  restoreMocks: true, // Optional: Restores mocks to their original implementation
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest", // Use ts-jest for TypeScript files
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  moduleDirectories: ["node_modules", "src"],
  roots: ["<rootDir>"],
};

export default config;
