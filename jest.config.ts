import type { Config } from "jest";

const config: Config = {
  clearMocks: true,
  setupFilesAfterEnv: ["./shared/infra/testing/expect-helpers.ts"],
  coverageProvider: "v8",
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  rootDir: "./src",
  coverageDirectory: "../coverage",
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

export default config;
