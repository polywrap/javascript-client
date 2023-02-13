import { PolywrapClient, Uri } from "../..";
import { ensAddresses, providers } from "@polywrap/test-env-js";
import {
  Connection,
  Connections,
  ethereumPlugin,
} from "@polywrap/ethereum-plugin-js";
import { fileSystemPlugin } from "@polywrap/fs-plugin-js";
import { fileSystemResolverPlugin } from "@polywrap/fs-resolver-plugin-js";
import { ensResolverPlugin } from "@polywrap/ens-resolver-plugin-js";
import {
  PackageToWrapperCacheResolver,
  RecursiveResolver,
  WrapperCache,
} from "@polywrap/uri-resolvers-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import {
  defaultInterfaces,
  defaultEmbeddedPackages,
  defaultPackages,
} from "@polywrap/client-config-builder-js";
import { httpPlugin } from "@polywrap/http-plugin-js";

export const getClientWithEnsAndIpfs = () => {
  const connections: Connections = new Connections({
    networks: {
      testnet: new Connection({
        provider: providers.ethereum,
      }),
    },
    defaultNetwork: "testnet",
  });

  return new PolywrapClient({
    envs: [
      {
        uri: Uri.from(defaultPackages.ipfsResolver),
        env: {
          provider: providers.ipfs,
          retries: { tryResolveUri: 1, getFile: 1 },
        },
      },
    ],
    interfaces: [
      {
        interface: ExtendableUriResolver.extInterfaceUri,
        implementations: [
          Uri.from(defaultPackages.ipfsResolver),
          Uri.from(defaultPackages.ensResolver),
          Uri.from(defaultPackages.fileSystemResolver),
        ],
      },
      {
        interface: Uri.from(defaultInterfaces.ipfsHttpClient),
        implementations: [Uri.from(defaultInterfaces.ipfsHttpClient)],
      },
    ],
    resolver: RecursiveResolver.from([
      PackageToWrapperCacheResolver.from(
        [
          {
            uri: Uri.from(defaultInterfaces.ipfsHttpClient),
            package: defaultEmbeddedPackages.ipfsHttpClient(),
          },
          {
            uri: Uri.from(defaultPackages.ipfsResolver),
            package: defaultEmbeddedPackages.ipfsResolver(),
          },
          {
            uri: Uri.from(defaultPackages.ethereum),
            package: ethereumPlugin({ connections }),
          },
          {
            uri: Uri.from(defaultPackages.ensResolver),
            package: ensResolverPlugin({
              addresses: {
                testnet: ensAddresses.ensAddress,
              },
            }),
          },
          {
            uri: Uri.from(defaultInterfaces.fileSystem),
            package: fileSystemPlugin({}),
          },
          {
            uri: Uri.from(defaultPackages.fileSystemResolver),
            package: fileSystemResolverPlugin({}),
          },
          {
            uri: Uri.from(defaultInterfaces.http),
            package: httpPlugin({}),
          },
          new ExtendableUriResolver(),
        ],
        new WrapperCache()
      ),
    ]),
  });
};
