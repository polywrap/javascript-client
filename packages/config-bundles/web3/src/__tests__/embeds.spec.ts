import { embeds, getBundleConfig } from "../";

import { ClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { PolywrapClient, Uri } from "@polywrap/client-js"

describe("web config bundle embeds", () => {
  const client = new PolywrapClient(
    new ClientConfigBuilder()
      .add(getBundleConfig())
      .build()
  );

  for (const [name, data] of Object.entries(embeds)) {
    describe(`Embed: ${name}`, () => {
      const uris = [
        Uri.from(data.uri),
        Uri.from(data.source)
      ];

      for (const uri of uris) {
        it(`Load Wrap @ ${uri}`, async () => {
          const wrap = await client.loadWrapper(uri);
          expect(wrap.ok).toBeTruthy();
        });
      }
    });
  }
});
