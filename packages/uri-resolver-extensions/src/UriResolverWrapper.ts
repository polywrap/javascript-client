import { UriResolverExtensionFileReader } from "./UriResolverExtensionFileReader";

import {
  Uri,
  CoreClient,
  UriResolverInterface,
  IUriResolutionContext,
  UriPackageOrWrapper,
  IUriResolver,
  UriResolutionResult,
} from "@polywrap/core-js";
import { Result, ResultOk } from "@polywrap/result";
import { WasmPackage } from "@polywrap/wasm-js";

// $start: UriResolverWrapper
/**
 * An IUriResolver that delegates resolution to a wrapper that implements
 * the URI Resolver Extension Interface
 * */
export class UriResolverWrapper implements IUriResolver<unknown> /* $ */ {
  // $start: UriResolverWrapper-constructor
  /**
   * construct a UriResolverWrapper
   *
   * @param implementationUri - URI that resolves to a URI Resolver Extension implementation
   * */
  constructor(public readonly implementationUri: Uri) /* $ */ {}

  // $start: UriResolverWrapper-tryResolverUri
  /**
   * Attempt to resolve a URI by invoking a URI Resolver Extension wrapper, then
   * parse the result to a wrap package, a wrapper, or a URI
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
  ): Promise<Result<UriPackageOrWrapper, unknown>> /* $ */ {
    const resolverExtensionContext = resolutionContext.createSubContext();

    const result = await tryResolveUriWithImplementation(
      uri,
      this.implementationUri,
      client,
      resolverExtensionContext
    );

    const resolutionResult = result.ok
      ? getResult(result.value, uri, this.implementationUri, client)
      : UriResolutionResult.err(result.error);

    resolutionContext.trackStep({
      sourceUri: uri,
      result: resolutionResult,
      description: `ResolverExtension (${this.implementationUri.uri})`,
      subHistory: resolverExtensionContext.getHistory(),
    });

    return resolutionResult;
  }
}

const getResult = (
  uriOrManifest: UriResolverInterface.MaybeUriOrManifest | undefined,
  uri: Uri,
  implementationUri: Uri,
  client: CoreClient
): Result<UriPackageOrWrapper, unknown> => {
  if (uriOrManifest?.uri) {
    return UriResolutionResult.ok(new Uri(uriOrManifest.uri));
  } else if (uriOrManifest?.manifest) {
    const wrapPackage = WasmPackage.from(
      uriOrManifest.manifest,
      new UriResolverExtensionFileReader(implementationUri, uri, client)
    );

    return UriResolutionResult.ok(uri, wrapPackage);
  }

  return UriResolutionResult.ok(uri);
};

// $start: UriResolverWrapper-tryResolveUriWithImplementation
/**
 * Attempt to resolve a URI by invoking a URI Resolver Extension wrapper
 *
 * @param uri - the URI to resolve
 * @param implementationUri - URI that resolves to a URI Resolver Extension implementation
 * @param client - a CoreClient instance that will be used to invoke the URI Resolver Extension wrapper
 * @param resolutionContext - the current URI resolution context
 * @returns A Promise with a Result containing either URI or a manifest if successful
 */
const tryResolveUriWithImplementation = async (
  uri: Uri,
  implementationUri: Uri,
  client: CoreClient,
  resolutionContext: IUriResolutionContext
): Promise<
  Result<UriResolverInterface.MaybeUriOrManifest | undefined, unknown>
> /* $ */ => {
  const invokeResult = await client.invoke<UriResolverInterface.MaybeUriOrManifest>(
    {
      uri: implementationUri,
      method: "tryResolveUri",
      args: {
        authority: uri.authority,
        path: uri.path,
      },
      resolutionContext,
    }
  );

  if (!invokeResult.ok) {
    return invokeResult;
  }

  const uriOrManifest = invokeResult.value as UriResolverInterface.MaybeUriOrManifest;
  return ResultOk(uriOrManifest ?? undefined);
};
