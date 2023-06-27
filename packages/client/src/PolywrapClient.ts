import { InvokerOptions, TryResolveUriOptions } from "./types";

import { PolywrapCoreClient } from "@polywrap/core-client-js";
import {
  CoreClientConfig,
  GetFileOptions,
  GetImplementationsOptions,
  InvokeResult,
  IUriResolutionContext,
  IUriResolver,
  ReadonlyUriMap,
  Uri,
  UriPackageOrWrapper,
  ValidateOptions,
  WrapError,
  Wrapper,
  WrapperEnv,
} from "@polywrap/core-js";
import { Result, ResultErr, ResultOk } from "@polywrap/result";
import {
  compareSignature,
  DeserializeManifestOptions,
  ImportedModuleDefinition,
  WrapManifest,
} from "@polywrap/wrap-manifest-types-js";
import { Tracer, TracerConfig } from "@polywrap/tracing-js";
import { PolywrapClientConfigBuilder } from "@polywrap/client-config-builder-js";

export class PolywrapClient extends PolywrapCoreClient {
  // $start: PolywrapClient-constructor
  /**
   * Instantiate a PolywrapClient
   *
   * @param config - a client configuration
   */
  constructor(config?: CoreClientConfig) /* $ */ {
    super(config ?? new PolywrapClientConfigBuilder().addDefaults().build());
  }

  /**
   * Enable tracing for intricate debugging
   *
   * @remarks
   * Tracing uses the @polywrap/tracing-js package
   *
   * @param tracerConfig - configure options such as the tracing level
   * @returns void
   */
  public setTracingEnabled(tracerConfig?: Partial<TracerConfig>): void {
    if (tracerConfig?.consoleEnabled || tracerConfig?.httpEnabled) {
      Tracer.enableTracing("PolywrapClient", tracerConfig);
    } else {
      Tracer.disableTracing();
    }
  }

  @Tracer.traceMethod("PolywrapClient: getConfig")
  public getConfig(): CoreClientConfig {
    return super.getConfig();
  }

  @Tracer.traceMethod("PolywrapClient: getInterfaces")
  public getInterfaces(): ReadonlyUriMap<readonly Uri[]> | undefined {
    return super.getInterfaces();
  }

  @Tracer.traceMethod("PolywrapClient: getEnvs")
  public getEnvs(): ReadonlyUriMap<WrapperEnv> | undefined {
    return super.getEnvs();
  }

  @Tracer.traceMethod("PolywrapClient: getResolver")
  public getResolver(): IUriResolver<unknown> {
    return super.getResolver();
  }

  @Tracer.traceMethod("PolywrapClient: getEnvByUri")
  public getEnvByUri<TUri extends Uri | string = string>(
    uri: TUri
  ): WrapperEnv | undefined {
    return super.getEnvByUri(Uri.from(uri));
  }

  @Tracer.traceMethod("PolywrapClient: getManifest")
  public async getManifest<TUri extends Uri | string = string>(
    uri: TUri
  ): Promise<Result<WrapManifest, WrapError>> {
    return super.getManifest(Uri.from(uri));
  }

  @Tracer.traceMethod("PolywrapClient: getFile")
  public async getFile<TUri extends Uri | string = string>(
    uri: TUri,
    options: GetFileOptions
  ): Promise<Result<string | Uint8Array, WrapError>> {
    return super.getFile(Uri.from(uri), options);
  }

  @Tracer.traceMethod("PolywrapClient: getImplementations")
  public async getImplementations<TUri extends Uri | string = string>(
    uri: TUri,
    options?: GetImplementationsOptions
  ): Promise<Result<Uri[], WrapError>> {
    return super.getImplementations(Uri.from(uri), options);
  }

  @Tracer.traceMethod("PolywrapClient: invokeWrapper")
  public async invokeWrapper<
    TData = unknown,
    TUri extends Uri | string = string
  >(
    options: InvokerOptions<TUri> & { wrapper: Wrapper }
  ): Promise<InvokeResult<TData>> {
    return super.invokeWrapper({
      ...options,
      uri: Uri.from(options.uri),
    });
  }

  @Tracer.traceMethod("PolywrapClient: invoke")
  public async invoke<TData = unknown, TUri extends Uri | string = string>(
    options: InvokerOptions<TUri>
  ): Promise<InvokeResult<TData>> {
    return super.invoke({
      ...options,
      uri: Uri.from(options.uri),
    });
  }

  @Tracer.traceMethod("PolywrapClient: tryResolveUri")
  public async tryResolveUri<TUri extends Uri | string = string>(
    options: TryResolveUriOptions<TUri>
  ): Promise<Result<UriPackageOrWrapper, unknown>> {
    return super.tryResolveUri({
      ...options,
      uri: Uri.from(options.uri),
    });
  }

  @Tracer.traceMethod("PolywrapClient: loadWrapper")
  loadWrapper(
    uri: Uri,
    resolutionContext?: IUriResolutionContext,
    options?: DeserializeManifestOptions
  ): Promise<Result<Wrapper, WrapError>> {
    return super.loadWrapper(Uri.from(uri), resolutionContext, options);
  }

  // $start: PolywrapCoreClient-validate
  /**
   * Validate a wrapper, given a URI.
   * Optionally, validate the full ABI and/or recursively validate imports.
   *
   * @param uri - the Uri to resolve
   * @param options - { abi?: boolean; recursive?: boolean }
   * @returns A Promise with a Result containing a boolean or Error
   */
  @Tracer.traceMethod("PolywrapClient: validateConfig")
  public async validate<TUri extends Uri | string> /* $ */(
    uri: TUri,
    options: ValidateOptions
  ): Promise<Result<true, Error>> {
    const wrapper = await this.loadWrapper(Uri.from(uri));
    if (!wrapper.ok) {
      return ResultErr(new Error(wrapper.error?.message));
    }

    const { abi } = await wrapper.value.getManifest();
    const importedModules: ImportedModuleDefinition[] =
      abi.importedModuleTypes || [];

    const importUri = (importedModuleType: ImportedModuleDefinition) => {
      return this.tryResolveUri({ uri: importedModuleType.uri });
    };
    const resolvedModules = await Promise.all(importedModules.map(importUri));
    const modulesNotFound = resolvedModules.filter(({ ok }) => !ok) as {
      error: Error;
    }[];

    if (modulesNotFound.length) {
      const missingModules = modulesNotFound.map(({ error }) => {
        const uriIndex = error?.message.indexOf("\n");
        return error?.message.substring(0, uriIndex);
      });
      const error = new Error(JSON.stringify(missingModules));
      return ResultErr(error);
    }

    if (options.abi) {
      for (const importedModule of importedModules) {
        const importedModuleManifest = await this.getManifest(
          importedModule.uri
        );
        if (!importedModuleManifest.ok) {
          return ResultErr(importedModuleManifest.error);
        }
        const importedMethods =
          importedModuleManifest.value.abi.moduleType?.methods || [];

        const expectedMethods = importedModules.find(
          ({ uri }) => importedModule.uri === uri
        );

        const errorMessage = `ABI from Uri: ${importedModule.uri} is not compatible with Uri: ${uri}`;
        for (const [i, _] of Object.keys(importedMethods).entries()) {
          const importedMethod = importedMethods[i];

          if (expectedMethods?.methods && expectedMethods?.methods.length < i) {
            const expectedMethod = expectedMethods?.methods[i];
            const areEqual = compareSignature(importedMethod, expectedMethod);

            if (!areEqual) return ResultErr(new Error(errorMessage));
          } else {
            return ResultErr(new Error(errorMessage));
          }
        }
      }
    }

    if (options.recursive) {
      const validateImportedModules = importedModules.map(({ uri }) =>
        this.validate(uri, options)
      );
      const resolverUris = await Promise.all(validateImportedModules);
      const invalidUris = resolverUris.filter(({ ok }) => !ok) as {
        error: Error;
      }[];
      if (invalidUris.length) {
        const missingUris = invalidUris.map(({ error }) => {
          const uriIndex = error?.message.indexOf("\n");
          return error?.message.substring(0, uriIndex);
        });
        const error = new Error(JSON.stringify(missingUris));
        return ResultErr(error);
      }
    }
    return ResultOk(true);
  }
}
