import { ClientConfigBuilder, BuilderConfig } from "@polywrap/client-config-builder-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import { WasmPackage } from "@polywrap/wasm-js";
import * as EthProviderV1 from "@polywrap/ethereum-provider-js-v1";
import * as EthProvider from "@polywrap/ethereum-provider-js";
import * as ipfsHttpClient from "./embeds/ipfs-http-client/wrap";
import * as ipfsResolver from "./embeds/async-ipfs-resolver/wrap";

export const ipfsProviders: string[] = [
  "https://ipfs.wrappers.io",
  "https://ipfs.io",
];

interface IDefaultEmbed {
  uri: string;
  package: WasmPackage;
  source: string;
}

type UriResolverExtBootloader = [IDefaultEmbed, { from: string, to: string }, ...string[]];

export function getBundleConfig(): BuilderConfig {
  const plugins = {
    ethereumProviderV1: {
      uri: "plugin/ethereum-provider@1.1.0",
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
        "ens/wraps.eth:ethereum-provider@1.1.0",
        "ens/wraps.eth:ethereum-provider@1.0.0",
      ],
    },
    ethereumProviderV2: {
      uri: "plugin/ethereum-provider@2.0.0",
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
      implements: ["ens/wraps.eth:ethereum-provider@2.0.0"],
    }
  };

  const embeds = {
    ipfsHttpClient: {
      uri: "embed/ipfs-http-client@1.0.0",
      package: ipfsHttpClient.wasmPackage,
      source: "ens/wraps.eth:ipfs-http-client@1.0.0",
    },
    ipfsResolver: {
      uri: "embed/async-ipfs-uri-resolver-ext@1.0.1",
      package: ipfsResolver.wasmPackage,
      source: "ens/wraps.eth:async-ipfs-uri-resolver-ext@1.0.1",
    },
  };

  const uriResolverExts: UriResolverExtBootloader = [
    embeds.ipfsResolver,
    {
      from: "ens/wraps.eth:ens-text-record-uri-resolver-ext@1.0.1",
      to: "ipfs/QmXcHWtKkfrFmcczdMSXH7udsSyV3UJeoWzkaUqGBm1oYs",
    },
    "ens/wraps.eth:ens-uri-resolver-ext@1.0.1",
    "ens/wraps.eth:ens-ipfs-contenthash-uri-resolver-ext@1.0.1",
  ];

  const builder = new ClientConfigBuilder();

  for (const plugin of Object.values(plugins)) {
    builder.addPackage(plugin.uri, plugin.plugin);

    // Add all interface implementations & redirects
    for (const interfaceUri of plugin.implements) {
      builder.addInterfaceImplementation(interfaceUri, plugin.uri);
      builder.addRedirect(interfaceUri, plugin.uri);
    }
  }

  // Configure the ipfs-uri-resolver provider endpoints & retry counts
  builder.addEnv(embeds.ipfsResolver.source, {
    provider: ipfsProviders[0],
    fallbackProviders: ipfsProviders.slice(1),
    retries: { tryResolveUri: 2, getFile: 2 },
  });

  // Add all uri-resolver-ext interface implementations
  builder.addInterfaceImplementations(
    ExtendableUriResolver.defaultExtInterfaceUris[0].uri,
    [
      uriResolverExts[0].source,
      uriResolverExts[1].from,
      ...(uriResolverExts.slice(2) as string[]),
    ]
  );
  builder.addRedirect(uriResolverExts[1].from, uriResolverExts[1].to);

  return builder.config;
}
