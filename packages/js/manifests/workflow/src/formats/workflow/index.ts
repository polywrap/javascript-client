/* eslint-disable */
/**
 * This file was automatically generated by scripts/manifest/index-ts.mustache.
 * DO NOT MODIFY IT BY HAND. Instead, modify scripts/manifest/index-ts.mustache,
 * and run node ./scripts/manifest/generateFormatTypes.js to regenerate this file.
 */

import {
  PolywrapWorkflow as PolywrapWorkflow_0_1,
  Jobs as WorkflowJobs_0_1
} from "./0.1";

export {
  PolywrapWorkflow_0_1,
  WorkflowJobs_0_1,
};

export enum PolywrapWorkflowFormats {
  // NOTE: Patch fix for backwards compatability
  "v0.1.0" = "0.1.0",
  "v0.1" = "0.1",
}

export type AnyPolywrapWorkflow =
  | PolywrapWorkflow_0_1

export type WorkflowJobs =
   | WorkflowJobs_0_1
;

export type PolywrapWorkflow = PolywrapWorkflow_0_1;

export const latestPolywrapWorkflowFormat = PolywrapWorkflowFormats["v0.1"]

export { migratePolywrapWorkflow } from "./migrate";

export { deserializePolywrapWorkflow } from "./deserialize";

export { validatePolywrapWorkflow } from "./validate";
