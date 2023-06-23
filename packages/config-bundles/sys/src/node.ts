import * as Common from "./common";

import { ClientConfigBuilder, BuilderConfig } from "@polywrap/client-config-builder-js";

export const plugins = Common.plugins;

export const embeds = Common.embeds;

export const uriResolverExts = Common.uriResolverExts;

export async function getBundleConfig(): Promise<BuilderConfig> {
  const builder = new ClientConfigBuilder();

  builder.add(Common.getBundleConfig());

  // All all node-specific dependencies
  if (typeof window === "undefined") {
    const SysNode = await import("@polywrap/sys-node-config-bundle-js");
    builder.add(SysNode.getBundleConfig());
  }

  return builder.config;
}
