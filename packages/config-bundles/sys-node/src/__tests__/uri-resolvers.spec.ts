import { getBundleConfig } from "../";

import { ClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { PolywrapClient, Uri } from "@polywrap/client-js"
import path from "path";

describe("sys-node config bundle resolvers", () => {
  const client = new PolywrapClient(
    new ClientConfigBuilder()
      .add(getBundleConfig())
      .build()
  );

  describe("Resolver: file-system-resolver", () => {
    const wrapPath = path.join(__dirname, "../embeds/file-system-resolver");
    const uris = [
      Uri.from("fs/" + wrapPath),
      Uri.from("file/" + wrapPath)
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
