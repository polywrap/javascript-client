import {
  Uri,
  UriResolutionContext,
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
});
