import {
  Wrapper,
  CoreClient,
  GetFileOptions,
  WrapError,
  IUriResolutionContext,
  CoreClientConfig,
  GetImplementationsOptions,
  IUriResolver,
  InvokeResult,
  InvokerOptions,
  ReadonlyUriMap,
  TryResolveUriOptions,
  Uri,
  UriPackageOrWrapper,
  WrapperEnv,
} from "@polywrap/core-js";
import { WrapManifest } from "@polywrap/wrap-manifest-types-js";
import { Result } from "@polywrap/result";

export class ResolutionContextOverrideClient implements CoreClient {
  constructor(
    private readonly _client: CoreClient,
    private readonly _resolutionContext?: IUriResolutionContext
  ) {}

  public getConfig(): CoreClientConfig {
    return this._client.getConfig();
  }

  public getInterfaces(): ReadonlyUriMap<readonly Uri[]> | undefined {
    return this._client.getInterfaces();
  }

  public getEnvs(): ReadonlyUriMap<WrapperEnv> | undefined {
    return this._client.getEnvs();
  }

  public getResolver(): IUriResolver<unknown> {
    return this._client.getResolver();
  }

  public getEnvByUri(uri: Uri): WrapperEnv | undefined {
    return this._client.getEnvByUri(uri);
  }

  public async getManifest(uri: Uri): Promise<Result<WrapManifest, WrapError>> {
    return this._client.getManifest(uri);
  }

  public async getFile(
    uri: Uri,
    options: GetFileOptions
  ): Promise<Result<string | Uint8Array, WrapError>> {
    return this._client.getFile(uri, options);
  }

  public async getImplementations(
    uri: Uri,
    options: GetImplementationsOptions = {}
  ): Promise<Result<Uri[], WrapError>> /* $ */ {
    return this._client.getImplementations(uri, options);
  }

  public async invokeWrapper<TData = unknown>(
    options: InvokerOptions & { wrapper: Wrapper }
  ): Promise<InvokeResult<TData>> /* $ */ {
    return this._client.invokeWrapper({
      ...options,
      resolutionContext: options.resolutionContext ?? this._resolutionContext,
    });
  }

  public async invoke<TData = unknown>(
    options: InvokerOptions
  ): Promise<InvokeResult<TData>> /* $ */ {
    return this._client.invoke({
      ...options,
      resolutionContext: options.resolutionContext ?? this._resolutionContext,
    });
  }

  public async tryResolveUri(
    options: TryResolveUriOptions
  ): Promise<Result<UriPackageOrWrapper, unknown>> /* $ */ {
    return this._client.tryResolveUri({
      ...options,
      resolutionContext: options.resolutionContext ?? this._resolutionContext,
    });
  }
}
