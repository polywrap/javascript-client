/* eslint-disable */
import { IWrapPackage } from "@polywrap/core-js";
import { Bundle } from "@polywrap/config-bundle-types-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";

// $start: bundle
import { loggerPlugin } from "@polywrap/logger-plugin-js";
import { dateTimePlugin } from "@polywrap/datetime-plugin-js";
import { concurrentPromisePlugin } from "@polywrap/concurrent-plugin-js";
import { httpPlugin } from "@polywrap/http-plugin-js";
import * as httpResolver from "./embeds/http-resolver/wrap";

export const bundle: Bundle = {
  logger: {
    uri: "plugin/logger@1.0.0",
    package: loggerPlugin({}) as IWrapPackage,
    implements: ["ens/wraps.eth:logger@1.0.0"],
    redirectFrom: ["ens/wraps.eth:logger@1.0.0"],
  },
  datetime: {
    uri: "plugin/datetime@1.0.0",
    package: dateTimePlugin({}) as IWrapPackage,
    implements: ["ens/wraps.eth:datetime@1.0.0"],
    redirectFrom: ["ens/wraps.eth:datetime@1.0.0"],
  },
  concurrent: {
    uri: "plugin/concurrent@1.0.0",
    package: concurrentPromisePlugin({}) as IWrapPackage,
    implements: ["ens/wraps.eth:concurrent@1.0.0"],
    redirectFrom: ["ens/wraps.eth:concurrent@1.0.0"],
  },
  http: {
    uri: "plugin/http@1.1.0",
    package: httpPlugin({}) as IWrapPackage,
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
  githubResolver: {
    uri: "wrap://ipfs/QmYPp2bQpRxR7WCoiAgWsWoiQzqxyFdqWxp1i65VW8wNv2",
    implements: [ExtendableUriResolver.defaultExtInterfaceUris[0].uri],
  }
};
// $end
