import * as httpResolver from "./embeds/http-resolver/wrap";

import { Bundle } from "@polywrap/config-bundle-types-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import { loggerPlugin } from "@polywrap/logger-plugin-js";
import { dateTimePlugin } from "@polywrap/datetime-plugin-js";
import { concurrentPromisePlugin } from "@polywrap/concurrent-plugin-js";
import { httpPlugin } from "@polywrap/http-plugin-js";

export const bundle: Bundle = {
  logger: {
    uri: "plugin/logger@1.0.0",
    package: loggerPlugin({}),
    implements: ["ens/wraps.eth:logger@1.0.0"],
    redirectFrom: ["ens/wraps.eth:logger@1.0.0"],
  },
  datetime: {
    uri: "plugin/datetime@1.0.0",
    package: dateTimePlugin({}),
    implements: ["ens/wraps.eth:datetime@1.0.0"],
    redirectFrom: ["ens/wraps.eth:datetime@1.0.0"],
  },
  concurrent: {
    uri: "plugin/concurrent@1.0.0",
    package: concurrentPromisePlugin({}),
    implements: ["ens/wraps.eth:concurrent@1.0.0"],
    redirectFrom: ["ens/wraps.eth:concurrent@1.0.0"],
  },
  http: {
    uri: "plugin/http@1.1.0",
    package: httpPlugin({}),
    implements: ["ens/wraps.eth:http@1.1.0", "ens/wraps.eth:http@1.0.0"],
    redirectFrom: ["ens/wraps.eth:http@1.1.0", "ens/wraps.eth:http@1.0.0"],
  },
  httpResolver: {
    uri: "embed/http-uri-resolver-ext@1.0.1",
    package: httpResolver.wasmPackage,
    implements: [
      "ens/wraps.eth:http-uri-resolver-ext@1.0.1",
      ExtendableUriResolver.defaultExtInterfaceUris[0].uri,
    ],
    redirectFrom: ["ens/wraps.eth:http-uri-resolver-ext@1.0.1"],
  },
};
