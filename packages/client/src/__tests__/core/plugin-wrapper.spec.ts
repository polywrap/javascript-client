import { PolywrapClient } from "../..";
import { IWrapPackage, Uri } from "@polywrap/core-js";
import { WrapManifest } from "@polywrap/wrap-manifest-types-js";
import { PluginPackage, PluginModule } from "@polywrap/plugin-js";
import { UriResolver } from "@polywrap/uri-resolvers-js";
import * as SysBundle from "@polywrap/sys-config-bundle-js"

jest.setTimeout(200000);

describe("plugin-wrapper", () => {
  const mockMapPlugin = () => {
    interface Config extends Record<string, unknown> {
      map: Map<string, number>;
    }

    class MockMapPlugin extends PluginModule<Config> {
      async getMap(_: unknown) {
        return this.config.map;
      }

      updateMap(args: { map: Map<string, number> }): Map<string, number> {
        for (const key of args.map.keys()) {
          this.config.map.set(
            key,
            (this.config.map.get(key) || 0) + (args.map.get(key) || 0)
          );
        }
        return this.config.map;
      }
    }

    return new PluginPackage(
      new MockMapPlugin({
        map: new Map().set("a", 1).set("b", 2),
      }),
      {} as WrapManifest
    );
  };

  test("plugin map types", async () => {
    const implementationUri = Uri.from("wrap://ens/some-implementation.eth");
    const mockPlugin = mockMapPlugin();
    const client = new PolywrapClient(
      {
        resolver: UriResolver.from([
          {
            uri: implementationUri,
            package: mockPlugin,
          },
        ]),
      }
    );

    const getResult = await client.invoke({
      uri: implementationUri,
      method: "getMap",
    });

    if (!getResult.ok) fail(getResult.error);
    expect(getResult.value).toBeTruthy();
    expect(getResult.value).toMatchObject(
      new Map<string, number>().set("a", 1).set("b", 2)
    );

    const updateResult = await client.invoke({
      uri: implementationUri,
      method: "updateMap",
      args: {
        map: new Map<string, number>().set("b", 1).set("c", 5),
      },
    });

    if (!updateResult.ok) fail(updateResult.error);
    expect(updateResult.value).toBeTruthy();
    expect(updateResult.value).toMatchObject(
      new Map<string, number>().set("a", 1).set("b", 3).set("c", 5)
    );
  });

  test("get manifest should fetch wrap manifest from plugin", async () => {
    const client = new PolywrapClient(
      {
        resolver: UriResolver.from([
          {
            uri: Uri.from(SysBundle.bundle.http.uri),
            package: SysBundle.bundle.http.package as IWrapPackage
          },
        ]),
      }
    );
    const manifest = await client.getManifest(SysBundle.bundle.http.uri);
    if (!manifest.ok) fail(manifest.error);
    expect(manifest.value.type).toEqual("plugin");
    expect(manifest.value.name).toEqual("Http");
  });
});
