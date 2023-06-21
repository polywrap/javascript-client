import * as fsResolver from "./embeds/file-system-resolver/wrap";

import * as Sys from "@polywrap/sys-config-bundle-js";
import {
  ClientConfigBuilder,
  BuilderConfig,
} from "@polywrap/client-config-builder-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import { fileSystemPlugin } from "@polywrap/file-system-plugin-js";

export const plugins = {
  fileSystem: {
    uri: "plugin/file-system@1.0.0",
    plugin: fileSystemPlugin({}),
    implements: ["ens/wraps.eth:file-system@1.0.0"],
  },
};

export const embeds = {
  fsResolver: {
    uri: "embed/file-system-uri-resolver-ext@1.0.1",
    package: fsResolver.wasmPackage,
    source: "ens/wraps.eth:file-system-uri-resolver-ext@1.0.1",
  },
};

export const uriResolverExts = [embeds.fsResolver];

export const baseConfig = Sys.getBundleConfig();

export function getBundleConfig(): BuilderConfig {
  const builder = new ClientConfigBuilder();

  // Add the base "sys" config
  builder.add(baseConfig);

  // Add all plugin packages
  for (const plugin of Object.values(plugins)) {
    builder.addPackage(plugin.uri, plugin.plugin);

    // Add all interface implementations & redirects
    for (const interfaceUri of plugin.implements) {
      builder.addInterfaceImplementation(interfaceUri, plugin.uri);
      builder.addRedirect(interfaceUri, plugin.uri);
    }
  }

  // Add all embedded packages
  for (const embed of Object.values(embeds)) {
    builder.addPackage(embed.uri, embed.package);

    // Add source redirect
    builder.addRedirect(embed.source, embed.uri);

    // Add source implementation
    builder.addInterfaceImplementation(embed.source, embed.uri);
  }

  // Add all uri-resolver-ext interface implementations
  builder.addInterfaceImplementations(
    ExtendableUriResolver.defaultExtInterfaceUris[0].uri,
    [uriResolverExts[0].source]
  );

  return builder.config;
}
