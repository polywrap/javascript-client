import { InfiniteLoopError } from "./InfiniteLoopError";
import { UriResolverLike } from "./UriResolverLike";
import { UriResolutionResult } from "./UriResolutionResult";
import { UriResolverFactory } from "./UriResolverFactory";

import { Result } from "@polywrap/result";
import {
  UriResolver,
  Uri,
  WrapClient,
  UriResolutionContext,
  UriPackageOrWrapper,
} from "@polywrap/wrap-js";

// $start: RecursiveResolver
/**
 * An IUriResolver implementation that makes the URI resolution process recursive.
 * It allows the resolution process to restart when URI redirects are encountered.
 * The RecursiveResolver wraps one or more resolvers and delegates resolution to them.
 * */
export class RecursiveResolver<TError = undefined>
  implements UriResolver<TError | InfiniteLoopError> /* $ */ {
  // $start: RecursiveResolver-constructor
  /**
   * Construct a RecursiveResolver
   *
   * @param _resolver - a resolver to delegate resolution to
   * */
  constructor(private _resolver: UriResolver<TError>) /* $ */ {}

  // $start: RecursiveResolver-from
  /**
   * Create a RecursiveResolver from a resolver-like object
   *
   * @param resolver - a resolver-like item to delegate resolution to
   *
   * @returns a RecursiveResolver
   * */
  static from<TResolverError = unknown>(
    resolver: UriResolverLike
  ): RecursiveResolver<TResolverError> /* $ */ {
    return new RecursiveResolver(UriResolverFactory.from<TResolverError>(resolver));
  }

  // $start: RecursiveResolver-tryResolveUri
  /**
   * Resolve a URI to a wrap package, a wrapper, or a URI.
   * If the URI resolves to a new URI, attempt to resolve thew new URI.
   *
   * @param uri - the URI to resolve
   * @param client - a CoreClient instance that may be used to invoke a wrapper that implements the UriResolver interface
   * @param resolutionContext - the current URI resolution context
   * @returns A Promise with a Result containing either a wrap package, a wrapper, or a URI if successful
   */
  async tryResolveUri(
    uri: Uri,
    client: WrapClient,
    resolutionContext: UriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TError | InfiniteLoopError>> /* $ */ {
    if (resolutionContext.isResolving(uri)) {
      return UriResolutionResult.err(
        new InfiniteLoopError(uri, resolutionContext.getHistory())
      );
    }

    resolutionContext.startResolving(uri);

    const resolverResult = await this._resolver.tryResolveUri(
      uri,
      client,
      resolutionContext
    );

    const result = await this._tryResolveAgainIfRedirect(
      resolverResult,
      uri,
      client,
      resolutionContext
    );

    resolutionContext.stopResolving(uri);

    return result;
  }

  private async _tryResolveAgainIfRedirect(
    result: Result<UriPackageOrWrapper, TError | InfiniteLoopError>,
    uri: Uri,
    client: WrapClient,
    resolutionContext: UriResolutionContext
  ): Promise<Result<UriPackageOrWrapper, TError | InfiniteLoopError>> {
    if (result.ok && result.value.type === "uri") {
      const resultUri = result.value.uri;

      if (resultUri.uri !== uri.uri) {
        result = await this.tryResolveUri(resultUri, client, resolutionContext);
      }
    }

    return result;
  }
}
