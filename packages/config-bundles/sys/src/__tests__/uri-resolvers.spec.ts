import { getBundleConfig } from "../";

import { ClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { PolywrapClient, Uri } from "@polywrap/client-js"

describe("sys config bundle resolvers", () => {
  const client = new PolywrapClient(
    new ClientConfigBuilder()
      .add(getBundleConfig())
      .build()
  );

  describe("Resolver: http-resolver", () => {
    const wrapPath = "https://raw.githubusercontent.com/polywrap/client-readiness/main/wraps/public";
    const uris = [
      Uri.from("http/" + wrapPath),
      Uri.from("https/" + wrapPath)
    ];

    for (const uri of uris) {
      it(`Resolves: ${uri}`, async () => {
        const result = await client.tryResolveUri({ uri });
    
        expect(result.ok).toBeTruthy();
        if (!result.ok) throw "should never happen";
        expect(result.value.uri).toBe(uri);
        expect(result.value.type).toBe("package");
      });
    }
  });
});
