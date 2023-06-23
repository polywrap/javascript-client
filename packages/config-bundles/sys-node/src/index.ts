import * as fsResolver from "./embeds/file-system-resolver/wrap";

import { Bundle } from "@polywrap/config-bundle-types-js";
import { ExtendableUriResolver } from "@polywrap/uri-resolver-extensions-js";
import { fileSystemPlugin } from "@polywrap/file-system-plugin-js";

export const bundle: Bundle = {
  fileSystem: {
    uri: "plugin/file-system@1.0.0",
    package: fileSystemPlugin({}),
    implements: ["ens/wraps.eth:file-system@1.0.0"],
    redirectFrom: ["ens/wraps.eth:file-system@1.0.0"],
  },
  fileSystemResolver: {
    uri: "embed/file-system-uri-resolver-ext@1.0.1",
    package: fsResolver.wasmPackage,
    implements: [
      "ens/wraps.eth:file-system-uri-resolver-ext@1.0.1",
      ExtendableUriResolver.defaultExtInterfaceUris[0].uri,
    ],
    redirectFrom: ["ens/wraps.eth:file-system-uri-resolver-ext@1.0.1"],
  },
};
