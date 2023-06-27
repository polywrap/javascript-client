import { ExtendableUriResolver } from "../ExtendableUriResolver";
import { expectHistory } from "./helpers/expectHistory";

import {
  Uri,
  UriMap,
  UriResolutionContext,
  IWrapPackage,
  CoreClient,
} from "@polywrap/core-js";
import { PolywrapCoreClient } from "@polywrap/core-client-js";
import { PluginPackage } from "@polywrap/plugin-js";
import { WasmPackage } from "@polywrap/wasm-js";
import { RecursiveResolver, StaticResolver } from "@polywrap/uri-resolvers-js";
import { Commands } from "@polywrap/cli-js";
import path from "path";
import fs from "fs";

jest.setTimeout(600000);

const subinvokeResolverUri = Uri.from("wrap://package/subinvoke-resolver");
const customPluginResolverUri = Uri.from("wrap://package/test-resolver");
const customPluginResolver = PluginPackage.from(() => ({
  tryResolveUri: async (
    args: any
  ): Promise<{
    uri?: string | null;
    manifest?: Uint8Array | null;
  } | null> => {
    if (args.authority !== "test") {
      return null;
    }

    switch (args.path) {
      case "from":
        return {
          uri: Uri.from("test/to").uri,
        };
      case "package":
        return {
          manifest: new Uint8Array([]),
        };
      case "error":
        throw new Error("Test error");
      default:
        return null;
    }
  },
}));

const subinvokePluginResolver = PluginPackage.from(() => ({
  tryResolveUri: async (
    args: any,
    client: CoreClient
  ): Promise<{
    uri?: string | null;
    manifest?: Uint8Array | null;
  } | null> => {
    const result = await client.invoke<{
      uri?: string | null;
      manifest?: Uint8Array | null;
    } | null>({
      uri: Uri.from("wrap://package/test-resolver"),
      method: "tryResolveUri",
      args,
    });

    if (!result.ok) {
      throw result.error;
    }

    return result.value;
  },
}));

describe("Resolver extensions", () => {
  let testResolverPackage: IWrapPackage;
  let subinvokeResolverPackage: IWrapPackage;

  beforeAll(async () => {
    const testResolverDir = path.join(__dirname, "/wrappers/test-resolver");

    // Build the test-resolver wrapper
    await Commands.build(
      {},
      {
        cwd: testResolverDir,
      }
    );

    const wrapBuildDir = path.join(testResolverDir, "build");

    // Load the wrapper from disk
    testResolverPackage = WasmPackage.from(
      fs.readFileSync(path.join(wrapBuildDir, "wrap.info")),
      fs.readFileSync(path.join(wrapBuildDir, "wrap.wasm"))
    );

    const subinvokeResolverDir = path.join(
      __dirname,
      "/wrappers/subinvoke-resolver"
    );

    // Build the test-resolver wrapper
    await Commands.build(
      {},
      {
        cwd: subinvokeResolverDir,
      }
    );

    const subinvokeBuildDir = path.join(subinvokeResolverDir, "build");
    // Load the wrapper from disk
    subinvokeResolverPackage = WasmPackage.from(
      fs.readFileSync(path.join(subinvokeBuildDir, "wrap.info")),
      fs.readFileSync(path.join(subinvokeBuildDir, "wrap.wasm"))
    );
  });

  it("can resolve URI with plugin extension", async () => {
    const sourceUri = Uri.from(`test/from`);
    const redirectedUri = Uri.from("test/to");

    const client = new PolywrapCoreClient({
      interfaces: new UriMap<Uri[]>([
        [
          ExtendableUriResolver.defaultExtInterfaceUris[0],
          [customPluginResolverUri],
        ],
      ]),
      resolver: RecursiveResolver.from([
        StaticResolver.from([
          {
            uri: customPluginResolverUri,
            package: customPluginResolver,
          },
        ]),
        new ExtendableUriResolver(),
      ]),
    });

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({
      uri: sourceUri,
      resolutionContext,
    });

    await expectHistory(resolutionContext.getHistory(), "can-resolve-uri");

    if (!result.ok) {
      throw result.error;
    }

    if (result.value.type !== "uri") {
      throw Error("Expected a URI, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual(redirectedUri.uri);
  });

  it("can resolve URI with plugin extension and subinvoke", async () => {
    const sourceUri = Uri.from(`test/from`);
    const redirectedUri = Uri.from("test/to");

    const client = new PolywrapCoreClient({
      interfaces: new UriMap<Uri[]>([
        [
          ExtendableUriResolver.defaultExtInterfaceUris[0],
          [subinvokeResolverUri],
        ],
      ]),
      resolver: RecursiveResolver.from([
        StaticResolver.from([
          {
            uri: customPluginResolverUri,
            package: testResolverPackage,
          },
          {
            uri: subinvokeResolverUri,
            package: subinvokePluginResolver,
          },
        ]),
        new ExtendableUriResolver(),
      ]),
    });

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({
      uri: sourceUri,
      resolutionContext,
    });

    await expectHistory(
      resolutionContext.getHistory(),
      "can-resolve-uri-with-subinvoke"
    );

    if (!result.ok) {
      throw result.error;
    }

    if (result.value.type !== "uri") {
      throw Error("Expected a URI, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual(redirectedUri.uri);
  });

  it("can resolve a package with plugin extension", async () => {
    const sourceUri = Uri.from(`test/package`);
    const redirectedUri = Uri.from("test/package");

    const client = new PolywrapCoreClient({
      interfaces: new UriMap<Uri[]>([
        [
          ExtendableUriResolver.defaultExtInterfaceUris[0],
          [customPluginResolverUri],
        ],
      ]),
      resolver: RecursiveResolver.from([
        StaticResolver.from([
          {
            uri: customPluginResolverUri,
            package: customPluginResolver,
          },
        ]),
        new ExtendableUriResolver(),
      ]),
    });

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({
      uri: sourceUri,
      resolutionContext,
    });

    await expectHistory(resolutionContext.getHistory(), "can-resolve-package");

    if (!result.ok) {
      throw result.error;
    }

    if (result.value.type !== "package") {
      throw Error("Expected a package, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual(redirectedUri.uri);
  });

  it("can resolve package with plugin extension and subinvoke", async () => {
    const sourceUri = Uri.from(`test/package`);
    const redirectedUri = Uri.from("test/package");

    const client = new PolywrapCoreClient({
      interfaces: new UriMap<Uri[]>([
        [
          ExtendableUriResolver.defaultExtInterfaceUris[0],
          [subinvokeResolverUri],
        ],
      ]),
      resolver: RecursiveResolver.from([
        StaticResolver.from([
          {
            uri: customPluginResolverUri,
            package: testResolverPackage,
          },
          {
            uri: subinvokeResolverUri,
            package: subinvokePluginResolver,
          },
        ]),
        new ExtendableUriResolver(),
      ]),
    });

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({
      uri: sourceUri,
      resolutionContext,
    });

    await expectHistory(
      resolutionContext.getHistory(),
      "can-resolve-package-with-subinvoke"
    );

    if (!result.ok) {
      throw result.error;
    }

    if (result.value.type !== "package") {
      throw Error("Expected a package, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual(redirectedUri.uri);
  });

  it("shows the plugin resolver extension error", async () => {
    const sourceUri = Uri.from(`test/error`);

    const client = new PolywrapCoreClient({
      interfaces: new UriMap<Uri[]>([
        [
          ExtendableUriResolver.defaultExtInterfaceUris[0],
          [customPluginResolverUri],
        ],
      ]),
      resolver: RecursiveResolver.from([
        StaticResolver.from([
          {
            uri: customPluginResolverUri,
            package: customPluginResolver,
          },
        ]),
        new ExtendableUriResolver(),
      ]),
    });

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({
      uri: sourceUri,
      resolutionContext,
    });

    await expectHistory(
      resolutionContext.getHistory(),
      "shows-plugin-extension-error"
    );

    if (result.ok) {
      throw Error("Expected an error, received: " + result.value.type);
    }

    expect((result.error as Error)?.message).toEqual(
      `Test error
code: 51 WRAPPER INVOKE ABORTED
uri: wrap://package/test-resolver
method: tryResolveUri
args: {
  "authority": "test",
  "path": "error"
} `
    );
  });

  it("shows the plugin resolver extension error with subinvoke", async () => {
    const sourceUri = Uri.from(`test/error`);

    const client = new PolywrapCoreClient({
      interfaces: new UriMap<Uri[]>([
        [
          ExtendableUriResolver.defaultExtInterfaceUris[0],
          [subinvokeResolverUri],
        ],
      ]),
      resolver: RecursiveResolver.from([
        StaticResolver.from([
          {
            uri: customPluginResolverUri,
            package: testResolverPackage,
          },
          {
            uri: subinvokeResolverUri,
            package: subinvokePluginResolver,
          },
        ]),
        new ExtendableUriResolver(),
      ]),
    });

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({
      uri: sourceUri,
      resolutionContext,
    });

    await expectHistory(
      resolutionContext.getHistory(),
      "shows-plugin-extension-error-with-subinvoke",
      true
    );

    if (result.ok) {
      throw Error("Expected an error, received: " + result.value.type);
    }

    expect((result.error as Error)?.message).toMatch(/Test error/);
  });

  it("does not resolve a URI when not a match with plugin extension", async () => {
    const uri = new Uri("test/not-a-match");

    const client = new PolywrapCoreClient({
      interfaces: new UriMap<Uri[]>([
        [
          ExtendableUriResolver.defaultExtInterfaceUris[0],
          [customPluginResolverUri],
        ],
      ]),
      resolver: RecursiveResolver.from([
        StaticResolver.from([
          {
            uri: customPluginResolverUri,
            package: customPluginResolver,
          },
        ]),
        new ExtendableUriResolver(),
      ]),
    });

    const resolutionContext = new UriResolutionContext();
    const result = await client.tryResolveUri({ uri, resolutionContext });

    await expectHistory(resolutionContext.getHistory(), "not-a-match");

    if (!result.ok) {
      throw result.error;
    }

    if (result.value.type !== "uri") {
      throw Error("Expected a uri, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual("wrap://test/not-a-match");
  });

  it("does not resolve a URI when not a match with plugin extension and subinvoke", async () => {
    const uri = new Uri("test/not-a-match");

    const client = new PolywrapCoreClient({
      interfaces: new UriMap<Uri[]>([
        [
          ExtendableUriResolver.defaultExtInterfaceUris[0],
          [subinvokeResolverUri],
        ],
      ]),
      resolver: RecursiveResolver.from([
        StaticResolver.from([
          {
            uri: customPluginResolverUri,
            package: testResolverPackage,
          },
          {
            uri: subinvokeResolverUri,
            package: subinvokePluginResolver,
          },
        ]),
        new ExtendableUriResolver(),
      ]),
    });

    const resolutionContext = new UriResolutionContext();
    const result = await client.tryResolveUri({ uri, resolutionContext });

    await expectHistory(
      resolutionContext.getHistory(),
      "not-a-match-with-subinvoke"
    );

    if (!result.ok) {
      throw result.error;
    }

    if (result.value.type !== "uri") {
      throw Error("Expected a uri, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual("wrap://test/not-a-match");
  });

  it("can resolve URI with wasm extension", async () => {
    const sourceUri = Uri.from(`test/from`);
    const redirectedUri = Uri.from("test/to");

    const client = new PolywrapCoreClient({
      interfaces: new UriMap<Uri[]>([
        [
          ExtendableUriResolver.defaultExtInterfaceUris[0],
          [customPluginResolverUri],
        ],
      ]),
      resolver: RecursiveResolver.from([
        StaticResolver.from([
          {
            uri: customPluginResolverUri,
            package: testResolverPackage,
          },
        ]),
        new ExtendableUriResolver(),
      ]),
    });

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({
      uri: sourceUri,
      resolutionContext,
    });

    await expectHistory(resolutionContext.getHistory(), "can-resolve-uri");

    if (!result.ok) {
      throw result.error;
    }

    if (result.value.type !== "uri") {
      throw Error("Expected a URI, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual(redirectedUri.uri);
  });

  it("can resolve URI with wasm extension and subinvoke", async () => {
    const sourceUri = Uri.from(`test/from`);
    const redirectedUri = Uri.from("test/to");

    const subinvokeResolverUri = Uri.from("wrap://package/subinvoke-resolver");
    const client = new PolywrapCoreClient({
      interfaces: new UriMap<Uri[]>([
        [
          ExtendableUriResolver.defaultExtInterfaceUris[0],
          [subinvokeResolverUri],
        ],
      ]),
      resolver: RecursiveResolver.from([
        StaticResolver.from([
          {
            uri: customPluginResolverUri,
            package: testResolverPackage,
          },
          {
            uri: subinvokeResolverUri,
            package: subinvokeResolverPackage,
          },
        ]),
        new ExtendableUriResolver(),
      ]),
    });

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({
      uri: sourceUri,
      resolutionContext,
    });

    await expectHistory(
      resolutionContext.getHistory(),
      "can-resolve-uri-with-subinvoke"
    );

    if (!result.ok) {
      throw result.error;
    }

    if (result.value.type !== "uri") {
      throw Error("Expected a URI, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual(redirectedUri.uri);
  });

  it("can resolve a package with wasm extension", async () => {
    const sourceUri = Uri.from(`test/package`);
    const redirectedUri = Uri.from("test/package");

    const client = new PolywrapCoreClient({
      interfaces: new UriMap<Uri[]>([
        [
          ExtendableUriResolver.defaultExtInterfaceUris[0],
          [customPluginResolverUri],
        ],
      ]),
      resolver: RecursiveResolver.from([
        StaticResolver.from([
          {
            uri: customPluginResolverUri,
            package: testResolverPackage,
          },
        ]),
        new ExtendableUriResolver(),
      ]),
    });

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({
      uri: sourceUri,
      resolutionContext,
    });

    await expectHistory(resolutionContext.getHistory(), "can-resolve-package");

    if (!result.ok) {
      throw result.error;
    }

    if (result.value.type !== "package") {
      throw Error("Expected a package, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual(redirectedUri.uri);
  });

  it("can resolve a package with wasm extension and subinvoke", async () => {
    const sourceUri = Uri.from(`test/package`);
    const redirectedUri = Uri.from("test/package");

    const client = new PolywrapCoreClient({
      interfaces: new UriMap<Uri[]>([
        [
          ExtendableUriResolver.defaultExtInterfaceUris[0],
          [subinvokeResolverUri],
        ],
      ]),
      resolver: RecursiveResolver.from([
        StaticResolver.from([
          {
            uri: customPluginResolverUri,
            package: testResolverPackage,
          },
          {
            uri: subinvokeResolverUri,
            package: subinvokeResolverPackage,
          },
        ]),
        new ExtendableUriResolver(),
      ]),
    });

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({
      uri: sourceUri,
      resolutionContext,
    });

    await expectHistory(
      resolutionContext.getHistory(),
      "can-resolve-package-with-subinvoke"
    );

    if (!result.ok) {
      throw result.error;
    }

    if (result.value.type !== "package") {
      throw Error("Expected a package, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual(redirectedUri.uri);
  });

  it("shows the wasm resolver extension error", async () => {
    const sourceUri = Uri.from(`test/error`);

    const client = new PolywrapCoreClient({
      interfaces: new UriMap<Uri[]>([
        [
          ExtendableUriResolver.defaultExtInterfaceUris[0],
          [customPluginResolverUri],
        ],
      ]),
      resolver: RecursiveResolver.from([
        StaticResolver.from([
          {
            uri: customPluginResolverUri,
            package: testResolverPackage,
          },
        ]),
        new ExtendableUriResolver(),
      ]),
    });

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({
      uri: sourceUri,
      resolutionContext,
    });

    await expectHistory(
      resolutionContext.getHistory(),
      "shows-wasm-extension-error"
    );

    if (result.ok) {
      throw Error("Expected an error, received: " + result.value.type);
    }

    expect((result.error as Error)?.message).toEqual(
      `__wrap_abort: Test error
code: 51 WRAPPER INVOKE ABORTED
uri: wrap://package/test-resolver
method: tryResolveUri
args: {
  "authority": "test",
  "path": "error"
} 
source: { file: "src/wrap/module/wrapped.rs", row: 35, col: 21 }`
    );
  });

  it("shows the wasm resolver extension error with subinvoke", async () => {
    const sourceUri = Uri.from(`test/error`);

    const client = new PolywrapCoreClient({
      interfaces: new UriMap<Uri[]>([
        [
          ExtendableUriResolver.defaultExtInterfaceUris[0],
          [subinvokeResolverUri],
        ],
      ]),
      resolver: RecursiveResolver.from([
        StaticResolver.from([
          {
            uri: customPluginResolverUri,
            package: testResolverPackage,
          },
          {
            uri: subinvokeResolverUri,
            package: subinvokeResolverPackage,
          },
        ]),
        new ExtendableUriResolver(),
      ]),
    });

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({
      uri: sourceUri,
      resolutionContext,
    });

    await expectHistory(
      resolutionContext.getHistory(),
      "shows-wasm-extension-error-with-subinvoke"
    );

    if (result.ok) {
      throw Error("Expected an error, received: " + result.value.type);
    }

    expect((result.error as Error)?.message).toEqual(
      `SubInvocation exception encountered
code: 51 WRAPPER INVOKE ABORTED
uri: wrap://package/subinvoke-resolver
method: tryResolveUri
args: {
  "authority": "test",
  "path": "error"
} 
source: { file: "src/wrap/module/wrapped.rs", row: 35, col: 21 }

Another exception was encountered during execution:
WrapError: __wrap_abort: Test error
code: 51 WRAPPER INVOKE ABORTED
uri: wrap://package/test-resolver
method: tryResolveUri
args: {
  "authority": "test",
  "path": "error"
} 
source: { file: "src/wrap/module/wrapped.rs", row: 35, col: 21 }`
    );
  });

  it("does not resolve a URI when not a match with wasm extension", async () => {
    const uri = new Uri("test/not-a-match");

    const client = new PolywrapCoreClient({
      interfaces: new UriMap<Uri[]>([
        [
          ExtendableUriResolver.defaultExtInterfaceUris[0],
          [customPluginResolverUri],
        ],
      ]),
      resolver: RecursiveResolver.from([
        StaticResolver.from([
          {
            uri: customPluginResolverUri,
            package: testResolverPackage,
          },
        ]),
        new ExtendableUriResolver(),
      ]),
    });

    const resolutionContext = new UriResolutionContext();
    const result = await client.tryResolveUri({ uri, resolutionContext });

    await expectHistory(resolutionContext.getHistory(), "not-a-match");

    if (!result.ok) {
      throw result.error;
    }

    if (result.value.type !== "uri") {
      throw Error("Expected a uri, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual("wrap://test/not-a-match");
  });

  it("does not resolve a URI when not a match with wasm extension and subinvoke", async () => {
    const uri = new Uri("test/not-a-match");

    const client = new PolywrapCoreClient({
      interfaces: new UriMap<Uri[]>([
        [
          ExtendableUriResolver.defaultExtInterfaceUris[0],
          [subinvokeResolverUri],
        ],
      ]),
      resolver: RecursiveResolver.from([
        StaticResolver.from([
          {
            uri: customPluginResolverUri,
            package: testResolverPackage,
          },
          {
            uri: subinvokeResolverUri,
            package: subinvokeResolverPackage,
          },
        ]),
        new ExtendableUriResolver(),
      ]),
    });

    const resolutionContext = new UriResolutionContext();
    const result = await client.tryResolveUri({ uri, resolutionContext });

    await expectHistory(
      resolutionContext.getHistory(),
      "not-a-match-with-subinvoke"
    );

    if (!result.ok) {
      throw result.error;
    }

    if (result.value.type !== "uri") {
      throw Error("Expected a uri, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual("wrap://test/not-a-match");
  });

  it("does not cause infinite recursion when resolved at runtime when an extension is not found", async () => {
    const undefinedResolverUri = Uri.from("test/undefined-resolver");

    const client = new PolywrapCoreClient({
      interfaces: new UriMap<Uri[]>([
        [
          ExtendableUriResolver.defaultExtInterfaceUris[0],
          [undefinedResolverUri],
        ],
      ]),
      resolver: RecursiveResolver.from([new ExtendableUriResolver()]),
    });

    const resolutionContext = new UriResolutionContext();
    const result = await client.tryResolveUri({
      uri: Uri.from("test/not-a-match"),
      resolutionContext,
    });

    await expectHistory(resolutionContext.getHistory(), "not-found-extension");

    if (result.ok) {
      throw Error("Resoulution should have failed");
    }

    expect((result.error as Error)?.message).toEqual(
      `Unable to find URI wrap://test/undefined-resolver.
code: 28 URI NOT FOUND
uri: wrap://test/undefined-resolver
uriResolutionStack: [
  "wrap://test/undefined-resolver => UriResolverAggregator"
]`
    );
  });
});
