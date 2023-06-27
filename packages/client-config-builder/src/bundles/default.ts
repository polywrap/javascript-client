import { ClientConfigBuilder } from "../ClientConfigBuilder";
import { BuilderConfig } from "../types";
import * as ipfsHttpClient from "./embeds/ipfs-http-client/wrap";
import * as ipfsResolver from "./embeds/async-ipfs-resolver/wrap";

import { IWrapPackage, Uri } from "@polywrap/core-js";
import * as EthProviderV1 from "@polywrap/ethereum-provider-js-v1";
import * as EthProvider from "@polywrap/ethereum-provider-js";
import { httpPlugin } from "@polywrap/http-plugin-js";
import { fileSystemPlugin } from "@polywrap/file-system-plugin-js";
import { loggerPlugin } from "@polywrap/logger-plugin-js";
import { concurrentPromisePlugin } from "@polywrap/concurrent-plugin-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import { IUriRedirect } from "@polywrap/core-js";

// $start: getDefaultConfig
export const ipfsProviders: string[] = [
  "https://ipfs.wrappers.io",
  "https://ipfs.io",
];

interface IDefaultEmbed {
  uri: Uri;
  package: IWrapPackage;
  source: Uri;
}

interface IDefaultEmbeds {
  ipfsHttpClient: IDefaultEmbed;
  ipfsResolver: IDefaultEmbed;
}

export const embeds: IDefaultEmbeds = {
  ipfsHttpClient: {
    uri: Uri.from("embed/ipfs-http-client@1.0.0"),
    package: ipfsHttpClient.wasmPackage,
    source: Uri.from("ens/wraps.eth:ipfs-http-client@1.0.0"),
  },
  ipfsResolver: {
    uri: Uri.from("embed/async-ipfs-uri-resolver-ext@1.0.1"),
    package: ipfsResolver.wasmPackage,
    source: Uri.from("ens/wraps.eth:async-ipfs-uri-resolver-ext@1.0.1"),
  },
};

type UriResolverExtBootloader = [IDefaultEmbed, IUriRedirect, ...Uri[]];

export const uriResolverExts: UriResolverExtBootloader = [
  embeds.ipfsResolver,
  {
    from: Uri.from("ens/wraps.eth:ens-text-record-uri-resolver-ext@1.0.1"),
    to: Uri.from("ipfs/QmXcHWtKkfrFmcczdMSXH7udsSyV3UJeoWzkaUqGBm1oYs"),
  },
  Uri.from("ens/wraps.eth:http-uri-resolver-ext@1.0.1"),
  Uri.from("ens/wraps.eth:file-system-uri-resolver-ext@1.0.1"),
  Uri.from("ens/wraps.eth:ens-uri-resolver-ext@1.0.1"),
  Uri.from("ens/wraps.eth:ens-ipfs-contenthash-uri-resolver-ext@1.0.1"),
];

interface IDefaultPlugin {
  uri: Uri;
  plugin: IWrapPackage;
  implements: Uri[];
}

interface IDefaultPlugins {
  logger: IDefaultPlugin;
  http: IDefaultPlugin;
  fileSystem: IDefaultPlugin;
  concurrent: IDefaultPlugin;
  ethereumProviderV1: IDefaultPlugin;
  ethereumProviderV2: IDefaultPlugin;
}

export const plugins: IDefaultPlugins = {
  logger: {
    uri: Uri.from("plugin/logger@1.0.0"),
    plugin: loggerPlugin({}),
    implements: [Uri.from("ens/wraps.eth:logger@1.0.0")],
  },
  http: {
    uri: Uri.from("plugin/http@1.1.0"),
    plugin: httpPlugin({}),
    implements: [
      Uri.from("ens/wraps.eth:http@1.1.0"),
      Uri.from("ens/wraps.eth:http@1.0.0"),
    ],
  },
  fileSystem: {
    uri: Uri.from("plugin/file-system@1.0.0"),
    plugin: fileSystemPlugin({}),
    implements: [Uri.from("ens/wraps.eth:file-system@1.0.0")],
  },
  concurrent: {
    uri: Uri.from("plugin/concurrent@1.0.0"),
    plugin: concurrentPromisePlugin({}),
    implements: [Uri.from("ens/wraps.eth:concurrent@1.0.0")],
  },
  ethereumProviderV1: {
    uri: Uri.from("plugin/ethereum-provider@1.1.0"),
    plugin: EthProviderV1.plugin({
      connections: new EthProviderV1.Connections({
        networks: {
          mainnet: new EthProviderV1.Connection({
            provider:
              "https://mainnet.infura.io/v3/b00b2c2cc09c487685e9fb061256d6a6",
          }),
          goerli: new EthProviderV1.Connection({
            provider:
              "https://goerli.infura.io/v3/b00b2c2cc09c487685e9fb061256d6a6",
          }),
        },
      }),
    }),
    implements: [
      Uri.from("ens/wraps.eth:ethereum-provider@1.1.0"),
      Uri.from("ens/wraps.eth:ethereum-provider@1.0.0"),
    ],
  },
  ethereumProviderV2: {
    uri: Uri.from("plugin/ethereum-provider@2.0.0"),
    plugin: EthProvider.plugin({
      connections: new EthProvider.Connections({
        networks: {
          mainnet: new EthProvider.Connection({
            provider:
              "https://mainnet.infura.io/v3/b00b2c2cc09c487685e9fb061256d6a6",
          }),
          goerli: new EthProvider.Connection({
            provider:
              "https://goerli.infura.io/v3/b00b2c2cc09c487685e9fb061256d6a6",
          }),
        },
      }),
    }),
    implements: [Uri.from("ens/wraps.eth:ethereum-provider@2.0.0")],
  },
};

export function getConfig(): BuilderConfig {
  const builder = new ClientConfigBuilder();

  // Add all embedded packages
  for (const embed of Object.values(embeds)) {
    builder.addPackage(embed.uri.uri, embed.package);

    // Add source redirect
    builder.addRedirect(embed.source.uri, embed.uri.uri);

    // Add source implementation
    builder.addInterfaceImplementation(embed.source.uri, embed.uri.uri);
  }

  // Add all plugin packages
  for (const plugin of Object.values(plugins)) {
    builder.addPackage(plugin.uri.uri, plugin.plugin);

    // Add all interface implementations & redirects
    for (const interfaceUri of plugin.implements) {
      builder.addInterfaceImplementation(interfaceUri.uri, plugin.uri.uri);
      builder.addRedirect(interfaceUri.uri, plugin.uri.uri);
    }
  }

  // Add all uri-resolver-ext interface implementations
  builder.addInterfaceImplementations(
    ExtendableUriResolver.defaultExtInterfaceUris[0].uri,
    [
      uriResolverExts[0].source.uri,
      uriResolverExts[1].from.uri,
      ...uriResolverExts.slice(2).map((x: Uri) => x.uri),
    ]
  );
  builder.addRedirect(uriResolverExts[1].from.uri, uriResolverExts[1].to.uri);

  // Configure the ipfs-uri-resolver provider endpoints & retry counts
  builder.addEnv(embeds.ipfsResolver.source.uri, {
    provider: ipfsProviders[0],
    fallbackProviders: ipfsProviders.slice(1),
    retries: { tryResolveUri: 2, getFile: 2 },
  });

  return builder.config;
}
// $end
