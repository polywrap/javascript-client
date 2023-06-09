import {
  Uri,
  CoreClient,
  UriResolutionContext,
} from "@polywrap/core-js";
import { InfiniteLoopError, RecursiveResolver, UriResolver } from "../helpers";
import { StaticResolver } from "../static";

describe("redirects", () => {
  it("sanity - UriResolver", async () => {
    const uri1 = Uri.from("wrap://ens/some-uri1.eth");
    const uri2 = Uri.from("wrap://ens/some-uri2.eth");
    const resolver = UriResolver.from([
      { from: uri1, to: uri2 }
    ]);

    const redirectsResult = await resolver.tryResolveUri(uri1, {} as CoreClient, new UriResolutionContext());

    if (!redirectsResult.ok) {
      fail(redirectsResult.error);
    }

    if (redirectsResult.value.type !== "uri") {
      console.error(`Expected URI, received: `, redirectsResult.value);
      fail();
    }

    expect(redirectsResult.value.uri.uri).toEqual(uri2.uri);
  });

  it("sanity - StaticResolver", async () => {
    const uri1 = Uri.from("wrap://ens/some-uri1.eth");
    const uri2 = Uri.from("wrap://ens/some-uri2.eth");
    const resolver = StaticResolver.from([
      { from: uri1, to: uri2 }
    ]);

    const redirectsResult = await resolver.tryResolveUri(uri1, {} as CoreClient, new UriResolutionContext());

    if (!redirectsResult.ok) {
      fail(redirectsResult.error);
    }

    if (redirectsResult.value.type !== "uri") {
      console.log(`Expected URI, received: `, redirectsResult.value);
      fail();
    }

    expect(redirectsResult.value.uri.uri).toEqual(uri2.uri);
  });

  it("works with the redirect stack overrides - RecursiveResolver", async () => {
    const uri1 = Uri.from("wrap://ens/some-uri1.eth");
    const uri2 = Uri.from("wrap://ens/some-uri2.eth");
    const uri3 = Uri.from("wrap://ens/some-uri3.eth");

    const resolver = RecursiveResolver.from([
      {
        from: uri1,
        to: uri2
      },
      {
        from: uri2,
        to: uri3
      }
    ]);

    const redirectsResult = await resolver.tryResolveUri(uri1, {} as CoreClient, new UriResolutionContext());

    if (!redirectsResult.ok) {
      fail(redirectsResult.error);
    }

    if (redirectsResult.value.type !== "uri") {
      console.error(`Expected URI, received: `, redirectsResult.value);
      fail();
    }

    expect(redirectsResult.value.uri.uri).toEqual(uri3.uri);
  });

  it("works with the redirect stack overrides - RecursiveResolver with StaticResolver", async () => {
    const uri1 = Uri.from("wrap://ens/some-uri1.eth");
    const uri2 = Uri.from("wrap://ens/some-uri2.eth");
    const uri3 = Uri.from("wrap://ens/some-uri3.eth");

    const resolver = RecursiveResolver.from(
      StaticResolver.from([
        {
          from: uri1,
          to: uri2
        },
        {
          from: uri2,
          to: uri3
        }
      ])
    );

    const redirectsResult = await resolver.tryResolveUri(uri1, {} as CoreClient, new UriResolutionContext());

    if (!redirectsResult.ok) {
      fail(redirectsResult.error);
    }

    if (redirectsResult.value.type !== "uri") {
      console.log(`Expected URI, received: `, redirectsResult.value);
      fail();
    }

    expect(redirectsResult.value.uri.uri).toEqual(uri3.uri);
  });

  it("can not redirect to self - RecursiveResolver", async () => {
    const uri1 = Uri.from("wrap://ens/some-uri1.eth");
    const uri2 = Uri.from("wrap://ens/some-uri2.eth");

    const resolver = RecursiveResolver.from([
      {
        from: uri1,
        to: uri2
      },
      {
        from: uri2,
        to: uri1
      },
    ]);

    const redirectsResult = await resolver.tryResolveUri(uri1, {} as CoreClient, new UriResolutionContext());

    if (redirectsResult.ok) {
      console.error(`Expected error`, redirectsResult.value);
      fail();
    }

    expect((redirectsResult.error as InfiniteLoopError).message).toContain("An infinite loop was detected while resolving the URI");
  });


  it("can not redirect to self - RecursiveResolver with StaticResolver", async () => {
    const uri1 = Uri.from("wrap://ens/some-uri1.eth");
    const uri2 = Uri.from("wrap://ens/some-uri2.eth");

    const resolver = RecursiveResolver.from(
      StaticResolver.from([
        {
          from: uri1,
          to: uri2
        },
        {
          from: uri2,
          to: uri1
        },
      ]
    ));

    const redirectsResult = await resolver.tryResolveUri(uri1, {} as CoreClient, new UriResolutionContext());

    if (redirectsResult.ok) {
      console.log(`Expected error`, redirectsResult.value);
      fail();
    }

    expect((redirectsResult.error as InfiniteLoopError).message).toContain("An infinite loop was detected while resolving the URI");
  });
});
