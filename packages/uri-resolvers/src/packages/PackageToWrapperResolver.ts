import { UriResolver, UriResolverLike } from "../helpers";

import {
  IUriResolver,
  Uri,
  CoreClient,
  IUriResolutionContext,
  UriPackageOrWrapper,
  UriResolutionResult,
} from "@polywrap/core-js";
import { DeserializeManifestOptions } from "@polywrap/wrap-manifest-types-js";
import { Result } from "@polywrap/result";

// $start: PackageToWrapperResolver
/**
 * An IUriResolver implementation that initalizes wrappers from resolved packages.
 * The PackageToWrapperResolver wraps an IUriResolver implementation and delegates resolution to it.
 * */
export class PackageToWrapperResolver<TError>
  implements IUriResolver<TError | Error> /* $ */ {
  // $start: PackageToWrapperResolver-constructor
  /**
   * Creates a PackageToWrapperResolver
   *
   * @param _innerResolver - a resolver to delegate resolution to
   * @param _options - control wrapper manifest deserialization
   * */
  constructor(
    private _innerResolver: IUriResolver<TError>,
    private _options?: {
      deserializeManifestOptions?: DeserializeManifestOptions;
    }
  ) /* $ */ {}

  // $start: PackageToWrapperResolver-from
  /**
   * Creates a PackageToWrapperResolver from a resolver-like object
   *
   * @param innerResolver - a resolver-like item to delegate resolution to
   * @param options - control wrapper manifest deserialization
   *
   * @returns a PackageToWrapperResolver
   * */
  static from<TResolverError = unknown>(
    innerResolver: UriResolverLike,
    options?: { deserializeManifestOptions?: DeserializeManifestOptions }
  ): PackageToWrapperResolver<TResolverError> /* $ */ {
    return new PackageToWrapperResolver(
      UriResolver.from<TResolverError>(innerResolver),
      options
    );
  }

  // $start: PackageToWrapperResolver-tryResolveUri
  /**
   * Resolve a URI to a wrap package, a wrapper, or a URI.
   * If successful, cache the result.
   *
   * @param uri - the URI to resolve
   * @param client - a CoreClient instance that may be used to invoke a wrapper that implements the UriResolver interface
   * @param resolutionContext - the current URI resolution context
   * @returns A Promise with a Result containing either a wrap package, a wrapper, or a URI if successful
   */
  async tryResolveUri(
    uri: Uri,
    client: CoreClient,
    resolutionContext: IUriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TError | Error>> /* $ */ {
    const subContext = resolutionContext.createSubHistoryContext();

    let result = await this._innerResolver.tryResolveUri(
      uri,
      client,
      subContext
    );

    if (result.ok && result.value.type === "package") {
      const wrapPackage = result.value.package;

      const createResult = await wrapPackage.createWrapper({
        noValidate: this._options?.deserializeManifestOptions?.noValidate,
      });

      if (!createResult.ok) {
        return createResult;
      }

      const wrapper = createResult.value;

      result = UriResolutionResult.ok(result.value.uri, wrapper);
    }

    resolutionContext.trackStep({
      sourceUri: uri,
      result,
      subHistory: subContext.getHistory(),
      description: "PackageToWrapperResolver",
    });
    return result;
  }
}
