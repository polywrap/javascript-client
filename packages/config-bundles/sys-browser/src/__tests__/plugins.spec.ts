import { plugins, getBundleConfig } from "../";

import { ClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { PolywrapClient, Uri } from "@polywrap/client-js"

describe("sys-browser config bundle plugins", () => {
  const client = new PolywrapClient(
    new ClientConfigBuilder()
      .add(getBundleConfig())
      .build()
  );

  for (const [name, data] of Object.entries(plugins)) {
    describe(`Plugin: ${name}`, () => {
      const uris = [
        Uri.from(data.uri),
        ...data.implements.map(x => Uri.from(x))
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
