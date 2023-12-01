import type { Config } from "jest";

const config: Config = {
  clearMocks: true,
  setupFilesAfterEnv: ["./shared/infra/testing/expect-helpers.ts"],
  coverageProvider: "v8",
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  rootDir: "./src",
};

export default config;
