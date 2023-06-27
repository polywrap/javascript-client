import { ClientConfigBuilder } from "../";
import { Sys } from "./sys";
import { Web3 } from "./web3";

import { Bundle } from "@polywrap/config-bundle-types-js";

export { Sys, Web3 };

// $start: Bundles-bundleNames
export type BundleName = "sys" | "web3";
/* $ */

export function getBundle(name: BundleName): Bundle {
  switch (name) {
    case "sys":
      return Sys.bundle;
    case "web3":
      return Web3.bundle;
    default:
      throw Error(`Unknown bundle name "${name}".`);
  }
}

export function addBundle(
  name: BundleName,
  builder: ClientConfigBuilder
): ClientConfigBuilder {
  const bundle = getBundle(name);

  for (const bundlePackage of Object.values(bundle)) {
    // Add package
    if (bundlePackage.package) {
      builder.setPackage(bundlePackage.uri, bundlePackage.package);
    }

    // Add interface implementations
    if (bundlePackage.implements) {
      for (const interfaceUri of bundlePackage.implements) {
        builder.addInterfaceImplementation(interfaceUri, bundlePackage.uri);
      }
    }

    // Add all redirects
    if (bundlePackage.redirectFrom) {
      for (const redirectFrom of bundlePackage.redirectFrom) {
        builder.setRedirect(redirectFrom, bundlePackage.uri);
      }
    }

    // Add environment
    if (bundlePackage.env) {
      builder.addEnv(bundlePackage.uri, bundlePackage.env);
    }
  }

  return builder;
}
