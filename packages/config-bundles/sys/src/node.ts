/* eslint-disable */
import * as Common from "./common";

import { IWrapPackage } from "@polywrap/core-js";
import { Bundle } from "@polywrap/config-bundle-types-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";

// $start: bundle-node
import { fileSystemPlugin } from "@polywrap/file-system-plugin-js";
import * as fileSystemResolver from "./embeds/file-system-resolver/wrap";

export const bundle: Bundle = {
  ...Common.bundle,
  fileSystem: {
    uri: "plugin/file-system@1.0.0",
    package: fileSystemPlugin({}) as IWrapPackage,
    implements: ["ens/wraps.eth:file-system@1.0.0"],
    redirectFrom: ["ens/wraps.eth:file-system@1.0.0"],
  },
  fileSystemResolver: {
    uri: "embed/file-system-uri-resolver-ext@1.0.1",
    package: fileSystemResolver.wasmPackage,
    implements: [
      "ens/wraps.eth:file-system-uri-resolver-ext@1.0.1",
      ExtendableUriResolver.defaultExtInterfaceUris[0].uri,
    ],
    redirectFrom: ["ens/wraps.eth:file-system-uri-resolver-ext@1.0.1"],
  },
};
// $end
