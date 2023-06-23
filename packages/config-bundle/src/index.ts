import { IWrapPackage } from "@polywrap/core-js";

export interface Bundle {
  [name: string]: {
    uri: string;
    package?: IWrapPackage;
    implements?: string[];
    redirectFrom?: string[];
    env?: {
      [prop: string]: unknown;
    };
  };
}
