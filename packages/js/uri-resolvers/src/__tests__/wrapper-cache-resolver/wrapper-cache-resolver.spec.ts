import {
  CoreClient,
  IUriResolutionContext,
  IUriResolver,
  Result,
  Uri,
  UriPackageOrWrapper,
  UriResolutionContext,
} from "@polywrap/core-js";
import { expectHistory } from "../helpers/expectHistory";
import { UriResolutionResult } from "../../helpers";
import { PolywrapCoreClient } from "@polywrap/core-client-js";
import { PluginPackage } from "@polywrap/plugin-js";
import { WrapperCache, WrapperCacheResolver } from "../../cache";

jest.setTimeout(20000);

class SimplePackageResolver implements IUriResolver<Error> {
  async tryResolveUri(
    uri: Uri,
    client: CoreClient,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, Error>> {
    let result: Result<UriPackageOrWrapper, Error>;

    switch (uri.uri) {
      case "wrap://test/package":
        result = UriResolutionResult.ok(
          Uri.from("test/package"),
          PluginPackage.from(() => ({}))
        );
        break;
      case "wrap://test/wrapper":
        let wrapperResult = await PluginPackage.from(() => ({})).createWrapper();
        if (!wrapperResult.ok) {
          throw wrapperResult.error;
        }

        result = UriResolutionResult.ok(
          Uri.from("test/wrapper"),
          wrapperResult.value
        );
        break;
      case "wrap://test/from":
        result = UriResolutionResult.ok(
          Uri.from("test/to"),
        );
        break;
      default:
        throw new Error(`Unexpected URI: ${uri.uri}`);
    }

    resolutionContext.trackStep({
      sourceUri: uri,
      result,
      description: "SimplePackageResolver",
    });

    return result;
  }
}

describe("WrapperCacheResolver", () => {
  it("caches a resolved wrapper", async () => {
    const uri = new Uri("test/wrapper");

    const cache = new WrapperCache();
    const client = new PolywrapCoreClient({
      resolver: WrapperCacheResolver.from(
        new SimplePackageResolver(),
        cache
      ),
    });

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({ uri, resolutionContext });

    console.log(cache);
    await expectHistory(
      resolutionContext.getHistory(),
      "wrapper-cache-resolver",
      "wrapper-without-cache",
    );

    if (!result.ok) {
      fail(result.error);
    }

    if (result.value.type !== "wrapper") {
      fail("Expected a wrapper, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual("wrap://test/wrapper");

    resolutionContext = new UriResolutionContext();
    result = await client.tryResolveUri({ uri, resolutionContext });

    await expectHistory(
      resolutionContext.getHistory(),
      "wrapper-cache-resolver",
      "wrapper-with-cache",
    );

    if (!result.ok) {
      fail(result.error);
    }

    if (result.value.type !== "wrapper") {
      fail("Expected a wrapper, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual("wrap://test/wrapper");
  });

  it("does not cache a URI", async () => {
    const uri = new Uri("test/from");

    const client = new PolywrapCoreClient({
      resolver: WrapperCacheResolver.from(
        new SimplePackageResolver(),
        new WrapperCache()
      ),
    });

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({ uri, resolutionContext });

    await expectHistory(
      resolutionContext.getHistory(),
      "wrapper-cache-resolver",
      "uri-without-cache",
    );

    if (!result.ok) {
      fail(result.error);
    }

    if (result.value.type !== "uri") {
      fail("Expected a uri, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual("wrap://test/to");

    resolutionContext = new UriResolutionContext();
    result = await client.tryResolveUri({ uri, resolutionContext });

    await expectHistory(
      resolutionContext.getHistory(),
      "wrapper-cache-resolver",
      "uri-without-cache",
    );

    if (!result.ok) {
      fail(result.error);
    }

    if (result.value.type !== "uri") {
      fail("Expected a uri, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual("wrap://test/to");
  });

  it("does not cache a package", async () => {
    const uri = new Uri("test/package");

    const client = new PolywrapCoreClient({
      resolver: WrapperCacheResolver.from(
        new SimplePackageResolver(),
        new WrapperCache()
      ),
    });

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({ uri, resolutionContext });

    await expectHistory(
      resolutionContext.getHistory(),
      "wrapper-cache-resolver",
      "package-without-cache",
    );

    if (!result.ok) {
      fail(result.error);
    }

    if (result.value.type !== "package") {
      fail("Expected a package, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual("wrap://test/package");

    resolutionContext = new UriResolutionContext();
    result = await client.tryResolveUri({ uri, resolutionContext });

    await expectHistory(
      resolutionContext.getHistory(),
      "wrapper-cache-resolver",
      "package-without-cache",
    );

    if (!result.ok) {
      fail(result.error);
    }

    if (result.value.type !== "package") {
      fail("Expected a package, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual("wrap://test/package");
  });
});
