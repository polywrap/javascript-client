/* eslint-disable @typescript-eslint/naming-convention */
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface InfraManifest {
  format: "0.0.1-prealpha.1";
  dockerCompose?: unknown;
  env?: {
    /**
     * This interface was referenced by `undefined`'s JSON-Schema definition
     * via the `patternProperty` "^.*$".
     */
    [k: string]: string | number;
  };
  packages: {
    /**
     * This interface was referenced by `undefined`'s JSON-Schema definition
     * via the `patternProperty` "^.*$".
     */
    [k: string]: RemotePackage | LocalPackage;
  };
  __type: "InfraManifest";
}
export interface RemotePackage {
  package: string;
  registry: string;
  version: string;
  dockerComposePath?: string;
}
export interface LocalPackage {
  path: string;
}
