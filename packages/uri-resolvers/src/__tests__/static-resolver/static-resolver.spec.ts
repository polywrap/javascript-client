import {
  IWrapPackage,
  Uri,
  UriResolutionContext,
  Wrapper,
} from "@polywrap/core-js";
import { expectHistory } from "../helpers/expectHistory";
import { PolywrapCoreClient } from "@polywrap/core-client-js";
import { StaticResolver } from "../../static";

jest.setTimeout(20000);

describe("StaticResolver", () => {
  it("can redirect a uri", async () => {
    const uri = new Uri("test/from");

    const client = new PolywrapCoreClient({
      resolver: StaticResolver.from([
        {
          from: Uri.from("test/from"),
          to: Uri.from("test/to"),
        },
      ]),
    });

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({ uri, resolutionContext });

    await expectHistory(
      resolutionContext.getHistory(),
      "static-resolver",
      "can-redirect-a-uri"
    );

    if (!result.ok) {
      fail(result.error);
    }

    if (result.value.type !== "uri") {
      fail("Expected a uri, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual("wrap://test/to");
  });

  it("can resolve a package", async () => {
    const uri = new Uri("test/package");

    const client = new PolywrapCoreClient({
      resolver: StaticResolver.from([
        {
          uri: Uri.from("test/package"),
          package: {} as IWrapPackage,
        },
      ]),
    });

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({ uri, resolutionContext });

    await expectHistory(
      resolutionContext.getHistory(),
      "static-resolver",
      "can-resolve-a-package"
    );

    if (!result.ok) {
      fail(result.error);
    }

    if (result.value.type !== "package") {
      fail("Expected a package, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual("wrap://test/package");
  });

  it("can resolve a wrapper", async () => {
    const uri = new Uri("test/wrapper");

    const client = new PolywrapCoreClient({
      resolver: StaticResolver.from([
        {
          uri: Uri.from("test/wrapper"),
          wrapper: {} as Wrapper,
        },
      ]),
    });

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({ uri, resolutionContext });

    await expectHistory(
      resolutionContext.getHistory(),
      "static-resolver",
      "can-resolve-a-wrapper"
    );

    if (!result.ok) {
      fail(result.error);
    }

    if (result.value.type !== "wrapper") {
      fail("Expected a wrapper, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual("wrap://test/wrapper");
  });

  it("can not resolve unregistered uri", async () => {
    const uri = new Uri("test/not-a-match");

    const client = new PolywrapCoreClient({
      resolver: StaticResolver.from([]),
    });

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({ uri, resolutionContext });

    await expectHistory(
      resolutionContext.getHistory(),
      "static-resolver",
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
});
