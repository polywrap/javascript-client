import { PluginModule } from "./PluginModule";
import { PluginWrapper } from "./PluginWrapper";
import { GetPluginMethodsFunc, PluginModuleWithMethods } from "./utils";

import { WrapPackage, Wrapper } from "@polywrap/wrap-js";
import { Result, ResultOk } from "@polywrap/result";
import { WrapManifest } from "@polywrap/wrap-manifest-types-js";

export class PluginPackage<
  TConfig,
  TEnv extends Record<string, unknown> = Record<string, unknown>
> implements WrapPackage {
  constructor(
    private _pluginModule: PluginModule<TConfig, TEnv>,
    private _manifest: WrapManifest
  ) {}

  static from<
    TConfig,
    TEnv extends Record<string, unknown> = Record<string, unknown>
  >(
    pluginModule: PluginModule<TConfig, TEnv>,
    manifest?: WrapManifest
  ): PluginPackage<TConfig, TEnv>;
  static from<TEnv extends Record<string, unknown> = Record<string, unknown>>(
    getPluginFuncs: GetPluginMethodsFunc<TEnv>,
    manifest?: WrapManifest
  ): PluginPackage<never, TEnv>;
  static from<
    TConfig,
    TEnv extends Record<string, unknown> = Record<string, unknown>
  >(
    pluginModuleOrGetPluginFuncs:
      | PluginModule<TConfig, TEnv>
      | GetPluginMethodsFunc<TEnv>,
    manifest?: WrapManifest
  ): PluginPackage<TConfig, TEnv> {
    if (typeof pluginModuleOrGetPluginFuncs === "function") {
      const getPluginFuncs = pluginModuleOrGetPluginFuncs as GetPluginMethodsFunc;

      return new PluginPackage<TConfig, TEnv>(
        new PluginModuleWithMethods(getPluginFuncs),
        manifest || ({} as WrapManifest)
      ) as PluginPackage<TConfig, TEnv>;
    } else {
      return new PluginPackage<TConfig, TEnv>(
        pluginModuleOrGetPluginFuncs as PluginModule<TConfig, TEnv>,
        manifest || ({} as WrapManifest)
      );
    }
  }

  async getManifest(): Promise<Result<WrapManifest, Error>> {
    return ResultOk(this._manifest);
  }

  async createWrapper(): Promise<Result<Wrapper, Error>> {
    return ResultOk(new PluginWrapper(this._manifest, this._pluginModule));
  }
}
