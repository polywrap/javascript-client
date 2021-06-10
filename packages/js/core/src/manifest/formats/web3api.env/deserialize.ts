/* eslint-disable */
/**
 * This file was automatically generated by scripts/manifest/deserialize-ts.mustache.
 * DO NOT MODIFY IT BY HAND. Instead, modify scripts/manifest/deserialize-ts.mustache,
 * and run node ./scripts/manifest/generateFormatTypes.js to regenerate this file.
 */

import {
  EnvManifest,
  AnyEnvManifest,
  migrateEnvManifest,
  validateEnvManifest,
  latestEnvManifestFormat,
} from ".";
import { DeserializeManifestOptions } from "../../";

import { compare } from "semver";
import YAML from "js-yaml";
import { Tracer } from "@web3api/tracing-js";

export const deserializeEnvManifest = Tracer.traceFunc(
  "core: deserializeEnvManifest",
  (manifest: string, options?: DeserializeManifestOptions): EnvManifest => {
    const anyEnvManifest = YAML.safeLoad(manifest) as
      | AnyEnvManifest
      | undefined;

    if (!anyEnvManifest) {
      throw Error(`Unable to parse EnvManifest: ${manifest}`);
    }

    if (!options || !options.noValidate) {
      validateEnvManifest(anyEnvManifest, options?.extSchema);
    }

    const versionCompare = compare(
      anyEnvManifest.format,
      latestEnvManifestFormat
    );

    if (versionCompare === -1) {
      // Upgrade
      return migrateEnvManifest(anyEnvManifest, latestEnvManifestFormat);
    } else if (versionCompare === 1) {
      // Downgrade
      throw Error(
        `Cannot downgrade Web3API version ${anyEnvManifest.format}, please upgrade your Web3ApiClient package.`
      );
    } else {
      // Latest
      return anyEnvManifest as EnvManifest;
    }
  }
);
