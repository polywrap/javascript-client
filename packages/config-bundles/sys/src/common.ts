import * as httpResolver from "./embeds/http-resolver/wrap";

import {
  ClientConfigBuilder,
  BuilderConfig,
} from "@polywrap/client-config-builder-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import { loggerPlugin } from "@polywrap/logger-plugin-js";
import { dateTimePlugin } from "@polywrap/datetime-plugin-js";
import { concurrentPromisePlugin } from "@polywrap/concurrent-plugin-js";
import { httpPlugin } from "@polywrap/http-plugin-js";

export const plugins = {
  logger: {
    uri: "plugin/logger@1.0.0",
    plugin: loggerPlugin({}),
    implements: ["ens/wraps.eth:logger@1.0.0"],
  },
  datetime: {
    uri: "plugin/datetime@1.0.0",
    plugin: dateTimePlugin({}),
    implements: ["ens/wraps.eth:datetime@1.0.0"],
  },
  concurrent: {
    uri: "plugin/concurrent@1.0.0",
    plugin: concurrentPromisePlugin({}),
    implements: ["ens/wraps.eth:concurrent@1.0.0"],
  },
  http: {
    uri: "plugin/http@1.1.0",
    plugin: httpPlugin({}),
    implements: ["ens/wraps.eth:http@1.1.0", "ens/wraps.eth:http@1.0.0"],
  },
};

export const embeds = {
  httpResolver: {
    uri: "embed/http-uri-resolver-ext@1.0.1",
    package: httpResolver.wasmPackage,
    source: "ens/wraps.eth:http-uri-resolver-ext@1.0.1",
  },
};

export const uriResolverExts = [embeds.httpResolver];

export function getBundleConfig(): BuilderConfig {
  const builder = new ClientConfigBuilder();

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
