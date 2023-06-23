import { BuilderConfig } from "../types";

import { MaybeAsync } from "@polywrap/core-js";

export type BundleName = "sys" | "web3";

export const bundlePackages: Record<BundleName, string> = {
  sys: "@polywrap/sys-config-bundle-js",
  web3: "@polywrap/web3-config-bundle-js",
};

export interface BundleModule {
  getBundleConfig(): MaybeAsync<BuilderConfig>;
}

export async function loadBundleConfig(
  name: BundleName
): Promise<BuilderConfig> {
  const packageName = bundlePackages[name];

  if (!packageName) {
    throw Error(
      `Unknown bundle name "${name}". Supported bundle names: ${Object.keys(
        bundlePackages
      ).join(", ")}`
    );
  }

  const bundleModule: BundleModule = await import(packageName);

  if (!bundleModule) {
    throw Error(
      `Bundle ${name} at ${packageName} cannot be found, is it installed? Try 'npm i ${packageName}'`
    );
  }

  if (!bundleModule.getBundleConfig) {
    throw Error(
      `Bundle ${name} at ${packageName} is incompatible with the BundleModule interface, please ensure it uses the correct version of the client-config-builde package.`
    );
  }

  return await bundleModule.getBundleConfig();
}
