import { ClientConfigBuilder, BuilderConfig } from "@polywrap/client-config-builder-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import { httpPlugin } from "@polywrap/http-plugin-js";
import * as httpResolver from "./embeds/http-resolver/wrap";

export function getBundleConfig(): BuilderConfig {
  const plugins = {
    http: {
      uri: "plugin/http@1.1.0",
      plugin: httpPlugin({}),
      implements: [
        "ens/wraps.eth:http@1.1.0",
        "ens/wraps.eth:http@1.0.0",
      ],
    },
  };

  const embeds = {
    httpResolver: {
      uri: "embed/http-uri-resolver-ext@1.0.1",
      package: httpResolver.wasmPackage,
      source: "ens/wraps.eth:http-uri-resolver-ext@1.0.1",
    },
  };

  const uriResolverExts = [
    embeds.httpResolver
  ];

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
    ExtendableUriResolver.defaultExtInterfaceUris[0],
    [
      uriResolverExts[0].source
    ]
  );
}
