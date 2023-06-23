import * as Common from "./common";

import { Bundle } from "@polywrap/config-bundle-types-js";
import * as Node from "@polywrap/sys-node-config-bundle-js";

export const bundle: Bundle = {
  ...Common.bundle,
  ...Node.bundle
};
