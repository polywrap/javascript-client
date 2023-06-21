import { BuilderConfig } from "@polywrap/client-config-builder-js";
import * as Sys from "@polywrap/sys-config-bundle-js";

export const plugins = Sys.plugins;

export function getBundleConfig(): BuilderConfig {
  return Sys.getBundleConfig();
}
