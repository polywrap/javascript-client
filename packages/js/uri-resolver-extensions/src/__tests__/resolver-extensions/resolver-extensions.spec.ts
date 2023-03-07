import { Uri, UriResolutionContext } from "@polywrap/core-js";
import { expectHistory } from "../helpers/expectHistory";
import { PolywrapCoreClient } from "@polywrap/core-client-js";
import { RecursiveResolver, StaticResolver } from "@polywrap/uri-resolvers-js";
import { ExtendableUriResolver } from "../../ExtendableUriResolver";
import { GetPathToTestWrappers } from "@polywrap/test-cases";
import { fileSystemPlugin } from "@polywrap/file-system-plugin-js";
import { fileSystemResolverPlugin } from "@polywrap/fs-resolver-plugin-js";
import { PluginPackage } from "@polywrap/plugin-js";

jest.setTimeout(20000);

const wrapperPath = `${GetPathToTestWrappers()}/subinvoke/00-subinvoke/implementations/as`;
const wrapperUri = new Uri(`wrap://file/${wrapperPath}`);

const fsRedirectResolverWrapperPath = `${GetPathToTestWrappers()}/resolver/02-fs/implementations/rs`;
const fsRedirectResolverWrapperUri = new Uri(
  `wrap://file/${fsRedirectResolverWrapperPath}`
);

const fileSystemResolverUri = Uri.from("wrap://package/fs-resolver");
const fileSystemInterfaceUri = Uri.from(
  "wrap://ens/wraps.eth:file-system@1.0.0"
);

describe("Resolver extensions", () => {
  it("can resolve a resolver extension", async () => {
    const sourceUri = new Uri(`custom-fs/${wrapperPath}`);
    const redirectedUri = wrapperUri;

    const client = new PolywrapCoreClient({
      interfaces: [
        {
          interface: ExtendableUriResolver.defaultExtInterfaceUris[0],
          implementations: [
            fsRedirectResolverWrapperUri,
            fileSystemResolverUri,
          ],
        },
      ],
      resolver: RecursiveResolver.from([
        StaticResolver.from([
          {
            uri: Uri.from(fileSystemInterfaceUri),
            package: (fileSystemPlugin(
              {}
            ) as unknown) as PluginPackage<unknown>,
          },
          {
            uri: Uri.from(fileSystemResolverUri),
            package: fileSystemResolverPlugin({}),
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
      "resolver-extensions",
      "can-resolve-extension"
    );

    if (!result.ok) {
      fail(result.error);
    }

    if (result.value.type !== "package") {
      fail("Expected a package, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual(redirectedUri.uri);
  });

  it("does not resolve a uri when not a match", async () => {
    const uri = new Uri("test/not-a-match");

    const client = new PolywrapCoreClient({
      interfaces: [
        {
          interface: ExtendableUriResolver.defaultExtInterfaceUris[0],
          implementations: [
            fsRedirectResolverWrapperUri,
            Uri.from(fileSystemResolverUri),
          ],
        },
      ],
      resolver: RecursiveResolver.from([
        StaticResolver.from([
          {
            uri: Uri.from(fileSystemInterfaceUri),
            package: (fileSystemPlugin(
              {}
            ) as unknown) as PluginPackage<unknown>,
          },
          {
            uri: Uri.from(fileSystemResolverUri),
            package: fileSystemResolverPlugin({}),
          },
        ]),
        new ExtendableUriResolver(),
      ]),
    });

    const resolutionContext = new UriResolutionContext();
    const result = await client.tryResolveUri({ uri, resolutionContext });

    await expectHistory(
      resolutionContext.getHistory(),
      "resolver-extensions",
      "not-a-match"
    );

    if (!result.ok) {
      fail(result.error);
    }

    if (result.value.type !== "uri") {
      fail("Expected a uri, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual("wrap://test/not-a-match");
  });

  it("does not cause infinite recursion when resolved at runtime when an extension is not found", async () => {
    const undefinedResolverUri = Uri.from("test/undefined-resolver");

    const client = new PolywrapCoreClient({
      interfaces: [
        {
          interface: ExtendableUriResolver.defaultExtInterfaceUris[0],
          implementations: [undefinedResolverUri],
        },
      ],
      resolver: RecursiveResolver.from([new ExtendableUriResolver()]),
    });

    const resolutionContext = new UriResolutionContext();
    const result = await client.tryResolveUri({
      uri: Uri.from("test/not-a-match"),
      resolutionContext,
    });

    await expectHistory(
      resolutionContext.getHistory(),
      "resolver-extensions",
      "not-found-extension"
    );

    if (result.ok) {
      fail("Resoulution should have failed");
    }

    expect(result.error).toEqual(
      "While resolving wrap://test/not-a-match with URI resolver extension wrap://test/undefined-resolver, the extension could not be fully resolved. Last tried URI is wrap://test/undefined-resolver"
    );
  });
});
