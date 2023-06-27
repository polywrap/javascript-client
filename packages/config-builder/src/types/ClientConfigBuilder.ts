import { BuilderConfig } from "./configs";
import { BuildOptions } from "./BuildOptions";
import { BundleName } from "../bundles";

import { CoreClientConfig, Wrapper, IWrapPackage } from "@polywrap/core-js";
import { UriResolverLike } from "@polywrap/uri-resolvers-js";

export interface ClientConfigBuilder {
  config: BuilderConfig;

  // $start: ClientConfigBuilder-build
  /**
   * Build a sanitized core client configuration that can be passed to the PolywrapClient or PolywrapCoreClient constructors
   *
   * @param options - Use a custom wrapper cache or resolver
   * @returns CoreClientConfig that results from applying all the steps in the builder pipeline
   */
  build(options?: BuildOptions): CoreClientConfig;
  // $end

  // $start: ClientConfigBuilder-add
  /**
   * Add a partial BuilderConfig
   * This is equivalent to calling each of the plural add functions: `addEnvs`, `setWrappers`, etc.
   *
   * @param config: a partial BuilderConfig
   * @returns ClientConfigBuilder (mutated self)
   */
  add(config: Partial<BuilderConfig>): ClientConfigBuilder;
  // $end

  // $start: ClientConfigBuilder-addDefaults
  /**
   * Add the default configuration bundle
   *
   * @returns ClientConfigBuilder (mutated self)
   */
  addDefaults(): ClientConfigBuilder;
  // $end

  // $start: ClientConfigBuilder-addBundle
  /**
   * Add a default configuration bundle
   *
   * @returns Promise<ClientConfigBuilder> (mutated self)
   */
  addBundle(bundle: BundleName): ClientConfigBuilder;
  // $end

  // $start: ClientConfigBuilder-setWrapper
  /**
   * Add an embedded wrapper
   *
   * @param uri: uri of wrapper
   * @param wrapper: wrapper to be added
   * @returns ClientConfigBuilder (mutated self)
   */
  setWrapper(uri: string, wrapper: Wrapper): ClientConfigBuilder;
  // $end

  // $start: ClientConfigBuilder-setWrappers
  /**
   * Add one or more embedded wrappers.
   * This is equivalent to calling setWrapper for each wrapper.
   *
   * @param uriWrappers: an object where keys are uris and wrappers are value
   * @returns ClientConfigBuilder (mutated self)
   */
  setWrappers(uriWrappers: Record<string, Wrapper>): ClientConfigBuilder;
  // $end

  // $start: ClientConfigBuilder-removeWrapper
  /**
   * Remove an embedded wrapper
   *
   * @param uri: the wrapper's URI
   * @returns ClientConfigBuilder (mutated self)
   */
  removeWrapper(uri: string): ClientConfigBuilder;
  // $end

  // $start: ClientConfigBuilder-setPackage
  /**
   * Add an embedded wrap package
   *
   * @param uri: uri of wrapper
   * @param wrapPackage: package to be added
   * @returns ClientConfigBuilder (mutated self)
   */
  setPackage(uri: string, wrapPackage: IWrapPackage): ClientConfigBuilder;
  // $end

  // $start: ClientConfigBuilder-setPackages
  /**
   * Add one or more embedded wrap packages
   * This is equivalent to calling setPackage for each package
   *
   * @param uriPackages: an object where keys are uris and packages are value
   * @returns ClientConfigBuilder (mutated self)
   */
  setPackages(uriPackages: Record<string, IWrapPackage>): ClientConfigBuilder;
  // $end

  // $start: ClientConfigBuilder-removePackage
  /**
   * Remove an embedded wrap package
   *
   * @param uri: the package's URI
   * @returns ClientConfigBuilder (mutated self)
   */
  removePackage(uri: string): ClientConfigBuilder;
  // $end

  // $start: ClientConfigBuilder-addEnv
  /**
   * Add an Env.
   * If an Env is already associated with the uri, it is modified.
   *
   * @param uri: the wrapper's URI to associate with the Env
   * @param env: an object with the env variables for the uri
   * @returns ClientConfigBuilder (mutated self)
   */
  addEnv(uri: string, env: Record<string, unknown>): ClientConfigBuilder;
  // $end

  // $start: ClientConfigBuilder-addEnvs
  /**
   * Add one or more Envs
   * This is equivalent to calling addEnv for each Env
   *
   * @param uriEnvs: and object where key is the uri and value is the another object with the env variables for the uri
   * @returns ClientConfigBuilder (mutated self)
   */
  addEnvs(
    uriEnvs: Record<string, Record<string, unknown>>
  ): ClientConfigBuilder;
  // $end

  // $start: ClientConfigBuilder-removeEnv
  /**
   * Remove an Env
   *
   * @param uri: the URI associated with the Env
   * @returns ClientConfigBuilder (mutated self)
   */
  removeEnv(uri: string): ClientConfigBuilder;
  // $end

  // $start: ClientConfigBuilder-setEnv
  /**
   * Add an Env.
   * If an Env is already associated with the uri, it is replaced.
   *
   * @param uri: the wrapper's URI to associate with the Env
   * @param env: an object with the environment variables for the uri
   * @returns ClientConfigBuilder (mutated self)
   */
  setEnv(uri: string, env: Record<string, unknown>): ClientConfigBuilder;
  // $end

  // $start: ClientConfigBuilder-addInterfaceImplementation
  /**
   * Register an implementation of a single interface
   *
   * @param interfaceUri: the URI of the interface
   * @param implementationUri: the URI of the implementation
   * @returns ClientConfigBuilder (mutated self)
   */
  addInterfaceImplementation(
    interfaceUri: string,
    implementationUri: string
  ): ClientConfigBuilder;
  // $end

  // $start: ClientConfigBuilder-addInterfaceImplementations
  /**
   * Register one or more implementation of a single interface
   *
   * @param interfaceUri: the URI of the interface
   * @param implementationUris: a list of URIs for the implementations
   * @returns ClientConfigBuilder (mutated self)
   */
  addInterfaceImplementations(
    interfaceUri: string,
    implementationUris: Array<string>
  ): ClientConfigBuilder;
  // $end

  // $start: ClientConfigBuilder-removeInterfaceImplementation
  /**
   * Remove an implementation of a single interface
   *
   * @param interfaceUri: the URI of the interface
   * @param implementationUri: the URI of the implementation
   * @returns ClientConfigBuilder (mutated self)
   */
  removeInterfaceImplementation(
    interfaceUri: string,
    implementationUri: string
  ): ClientConfigBuilder;
  // $end

  // $start: ClientConfigBuilder-setRedirect
  /**
   * Add a redirect from one URI to another
   *
   * @param from: the URI to redirect from
   * @param to: the URI to redirect to
   * @returns ClientConfigBuilder (mutated self)
   */
  setRedirect(from: string, to: string): ClientConfigBuilder;
  // $end

  // $start: ClientConfigBuilder-setRedirects
  /**
   * Add an array of URI redirects
   *
   * @param redirects: an object where key is from and value is to
   * @returns ClientConfigBuilder (mutated self)
   */
  setRedirects(redirects: Record<string, string>): ClientConfigBuilder;
  // $end

  // $start: ClientConfigBuilder-removeRedirect
  /**
   * Remove a URI redirect
   *
   * @param from: the URI that is being redirected
   * @returns ClientConfigBuilder (mutated self)
   */
  removeRedirect(from: string): ClientConfigBuilder;
  // $end

  // $start: ClientConfigBuilder-addResolver
  /**
   * Add a URI Resolver, capable of resolving a URI to a wrapper
   *
   * @remarks
   * A UriResolverLike can be any one of:
   *     IUriResolver<unknown>
   *   | IUriRedirect<string>
   *   | IUriPackage<string>
   *   | IUriWrapper<string>
   *   | UriResolverLike[];
   *
   * @param resolver: A UriResolverLike
   * @returns ClientConfigBuilder (mutated self)
   */
  addResolver(resolver: UriResolverLike): ClientConfigBuilder;
  // $end

  // $start: ClientConfigBuilder-addResolvers
  /**
   * Add one or more URI Resolvers, capable of resolving URIs to wrappers
   *
   * @remarks
   * A UriResolverLike can be any one of:
   *     IUriResolver<unknown>
   *   | IUriRedirect<string>
   *   | IUriPackage<string>
   *   | IUriWrapper<string>
   *   | UriResolverLike[];
   *
   * @param resolvers: A list of UriResolverLike
   * @returns ClientConfigBuilder (mutated self)
   */
  addResolvers(resolvers: UriResolverLike[]): ClientConfigBuilder;
  // $end
}
