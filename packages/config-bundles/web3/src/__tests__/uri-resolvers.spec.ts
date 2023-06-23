import { getBundleConfig } from "../";

import { ClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { PolywrapClient, Uri } from "@polywrap/client-js"

jest.setTimeout(50000);

describe("web3 config bundle resolvers", () => {
  const client = new PolywrapClient(
    new ClientConfigBuilder()
      .add(getBundleConfig())
      .build()
  );

  describe("Resolver: ipfs-resolver", () => {
    const uris = [
      Uri.from("ipfs/QmcXXykMwLkVaWQ7s74VNVHhpNzCaNnUcAvoNedXwumZaG")
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

  describe("Resolver: ens-resolver", () => {
    const uris = [
      Uri.from("ens/wrap-link.eth")
    ];

    for (const uri of uris) {
      it(`Resolves: ${uri}`, async () => {
        const result = await client.tryResolveUri({ uri });

        expect(result.ok).toBeTruthy();
        if (!result.ok) throw "should never happen";
        expect(result.value.type).toBe("package");
      });
    }
  });

  describe("Resolver: ens-text-record-resolver", () => {
    const uris = [
      Uri.from("ens/wraps.eth:ens@1.0.0")
    ];

    for (const uri of uris) {
      it(`Resolves: ${uri}`, async () => {
        const result = await client.tryResolveUri({ uri });
    
        expect(result.ok).toBeTruthy();
        if (!result.ok) throw "should never happen";
        expect(result.value.type).toBe("package");
      });
    }
  });
});
