// js file only 
// const { createDefaultPreset } = require("ts-jest");

// const tsJestTransformCfg = createDefaultPreset().transform;

// /** @type {import("jest").Config} **/
// export default {
//   testEnvironment: "node",
//   transform: {
//     ...tsJestTransformCfg,
//   },
// };

// ts file only 
import type { Config } from "jest";
import { createDefaultPreset } from "ts-jest";

const tsJest = createDefaultPreset();

const config: Config = {
  testEnvironment: "node",

  // ts-jest transform
  transform: {
    ...tsJest.transform,
  },

  // test folder
  testMatch: ["**/test/**/*.test.ts"],

  // ES module support
  extensionsToTreatAsEsm: [".ts"],

  globals: {
    "ts-jest": {
      useESM: true,
    },
  },

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};

export default config;
