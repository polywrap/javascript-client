import {
  Uri,
  UriResolutionContext,
} from "@polywrap/core-js";
import { expectHistory } from "../helpers/expectHistory";
import { PolywrapCoreClient } from "@polywrap/core-client-js";
import { UriResolverAggregator } from "../../aggregator";

jest.setTimeout(20000);

describe("UriResolverAggregator", () => {
  const client = new PolywrapCoreClient({
    resolver: new UriResolverAggregator([
      {
        from: Uri.from("test/1"),
        to: Uri.from("test/2")
      },
      {
        from: Uri.from("test/2"),
        to: Uri.from("test/3")
      },
      {
        from: Uri.from("test/3"),
        to: Uri.from("test/4")
      }
    ], "TestAggregator")
  });

  it("can resolve using first resolver", async () => {
    const uri = new Uri("test/1");

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({ uri, resolutionContext });

    await expectHistory(
      resolutionContext.getHistory(),
      "aggregator-resolver",
      "can-resolve-using-first-resolver",
    );

    if (!result.ok) {
      fail(result.error);
    }

    if (result.value.type !== "uri") {
      fail("Expected a uri, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual("wrap://test/2");
  });

  it("can resolve using last resolver", async () => {
    const uri = new Uri("test/3");

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({ uri, resolutionContext });

    await expectHistory(
      resolutionContext.getHistory(),
      "aggregator-resolver",
      "can-resolve-using-last-resolver",
    );

    if (!result.ok) {
      fail(result.error);
    }

    if (result.value.type !== "uri") {
      fail("Expected a uri, received: " + result.value.type);
    }

    expect(result.value.uri.uri).toEqual("wrap://test/4");
  });


  it("does not resolve a uri when not a match", async () => {
    const uri = new Uri("test/not-a-match");

    let resolutionContext = new UriResolutionContext();
    let result = await client.tryResolveUri({ uri, resolutionContext });

    await expectHistory(
      resolutionContext.getHistory(),
      "aggregator-resolver",
      "not-a-match",
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
