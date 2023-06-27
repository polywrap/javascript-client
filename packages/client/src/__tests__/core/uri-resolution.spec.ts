import {
  Uri,
  UriPackageOrWrapper,
  UriResolutionContext,
  UriResolutionResult,
} from "@polywrap/core-js";
import { Result } from "@polywrap/result";
import { PolywrapClient, PolywrapClientConfigBuilder } from "../../";

jest.setTimeout(200000);

const expectResolutionResult = async (
  receivedResult: Result<UriPackageOrWrapper, unknown>,
  expectedResult: Result<UriPackageOrWrapper, unknown>,
): Promise<void> => {

  expect(expectedResult.ok).toEqual(receivedResult.ok);

  if (expectedResult.ok) {
    expect((receivedResult as { value: UriPackageOrWrapper }).value).toEqual(
      expect.objectContaining(expectedResult.value)
    );
  } else {
    expect(expectedResult.error).toEqual(
      (receivedResult as { error: unknown }).error
    );
  }
};

describe("URI resolution", () => {
  it("sanity", async () => {
    const uri = new Uri("ens/wraps.eth:uri-resolver-ext@1.1.0");

    const client = new PolywrapClient();

    const resolutionContext = new UriResolutionContext();
    const result = await client.tryResolveUri({ uri, resolutionContext });

    const expectResult = UriResolutionResult.ok(
      Uri.from("wrap://ipfs/QmSAXrSLcmGUkQRrApAtG5qTPmuRMMX2Zf1wihpguDQfbm")
    );

    if (expectResult.ok) {
      expectResult.value.type = "package";
    }

    await expectResolutionResult(
      result,
      expectResult,
    );
  });

  it("can resolve uri with custom resolver", async () => {
    const fromUri = new Uri(`test/from.eth`);
    const redirectUri = new Uri(`test/to.eth`);

    const config = new PolywrapClientConfigBuilder()
      .addDefaults()
      .addResolver({
        tryResolveUri: async (uri: Uri) => {
          if (uri.uri === fromUri.uri) {
            return UriResolutionResult.ok(redirectUri);
          }

          return UriResolutionResult.ok(uri);
        },
      })
      .build();

    const client = new PolywrapClient(config);

    const result = await client.tryResolveUri({
      uri: fromUri,
    });

    expect(result).toEqual(UriResolutionResult.ok(redirectUri));
  });
});
