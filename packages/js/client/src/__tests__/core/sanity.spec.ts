import { ClientConfigBuilder } from "@polywrap/client-config-js";
import {
  Bepis,
  coreInterfaceUris,
  PluginModule,
  Uri
} from "@polywrap/core-js";

import {
  PolywrapClient,
} from "../..";

jest.setTimeout(200000);

describe("sanity", () => {
  test("bepis", () => {
    const a = new Bepis();
    const b = new ClientConfigBuilder().getBepis();

    console.log(a instanceof Bepis);
    console.log(b instanceof Bepis);
    
    expect(a).toStrictEqual(b);
  });

  test("default client config", () => {
    const client = new PolywrapClient();
    const expectedPlugins = [
      new Uri("wrap://ens/ipfs.polywrap.eth"),
      new Uri("wrap://ens/ens-resolver.polywrap.eth"),
      new Uri("wrap://ens/ethereum.polywrap.eth"),
      new Uri("wrap://ens/http.polywrap.eth"),
      new Uri("wrap://ens/js-logger.polywrap.eth"),
      new Uri("wrap://ens/uts46.polywrap.eth"),
      new Uri("wrap://ens/sha3.polywrap.eth"),
      new Uri("wrap://ens/graph-node.polywrap.eth"),
      new Uri("wrap://ens/fs.polywrap.eth"),
      new Uri("wrap://ens/fs-resolver.polywrap.eth"),
      new Uri("wrap://ens/ipfs-resolver.polywrap.eth"),
    ];
    const actualPlugins = client.getPlugins().map(x => x.uri);
    
    console.log("expected", expectedPlugins[0] instanceof Uri);
    console.log("actual", actualPlugins[0] instanceof Uri);

    expect(client.getRedirects()).toStrictEqual([]);
    expect(expectedPlugins).toStrictEqual(actualPlugins);
    expect(client.getInterfaces()).toStrictEqual([
      {
        interface: coreInterfaceUris.uriResolver,
        implementations: [
          new Uri("wrap://ens/ipfs-resolver.polywrap.eth"),
          new Uri("wrap://ens/ens-resolver.polywrap.eth"),
          new Uri("wrap://ens/fs-resolver.polywrap.eth"),
        ],
      },
      {
        interface: coreInterfaceUris.logger,
        implementations: [new Uri("wrap://ens/js-logger.polywrap.eth")],
      },
    ]);
  });

  test("client noDefaults flag works as expected", async () => {
    let client = new PolywrapClient();
    expect(client.getPlugins().length !== 0).toBeTruthy();

    client = new PolywrapClient({}, {});
    expect(client.getPlugins().length !== 0).toBeTruthy();

    client = new PolywrapClient({}, { noDefaults: false });
    expect(client.getPlugins().length !== 0).toBeTruthy();

    client = new PolywrapClient({}, { noDefaults: true });
    expect(client.getPlugins().length === 0).toBeTruthy();
  });

  test("redirect registration", () => {
    const implementation1Uri = "wrap://ens/some-implementation1.eth";
    const implementation2Uri = "wrap://ens/some-implementation2.eth";

    const client = new PolywrapClient({
      redirects: [
        {
          from: implementation1Uri,
          to: implementation2Uri,
        },
      ],
    });

    const redirects = client.getRedirects();

    expect(redirects).toEqual([
      {
        from: new Uri(implementation1Uri),
        to: new Uri(implementation2Uri),
      },
    ]);
  });

  test("loadPolywrap - pass string or Uri", async () => {
    const implementationUri = "wrap://ens/some-implementation.eth";
    const schemaStr = "test-schema";

    const client = new PolywrapClient({
      plugins: [
        {
          uri: implementationUri,
          plugin: {
            factory: () => ({} as PluginModule<{}>),
            manifest: {
              schema: schemaStr,
              implements: [],
            },
          },
        },
      ],
    });

    const schemaWhenString = await client.getSchema(implementationUri);
    const schemaWhenUri = await client.getSchema(new Uri(implementationUri));

    expect(schemaWhenString).toEqual(schemaStr);
    expect(schemaWhenUri).toEqual(schemaStr);
  });
});
