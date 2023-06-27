# PolywrapClient Config Builder

A utility class for building the PolywrapClient config. 

Supports building configs using method chaining or imperatively.

## Quickstart

### Initialize

Initialize a ClientConfigBuilder using the [constructor](#constructor)

```typescript
  // start with a blank slate (typical usage)
  const builder = new PolywrapClientConfigBuilder();
```

### Configure

Add client configuration with [add](#add), or flexibly mix and match builder [configuration methods](#setWrapper) to add and remove configuration items.

```typescript
  // add multiple items to the configuration using the catch-all `add` method
  builder.add({
    envs: {},
    interfaces: {},
    redirects: {},
    wrappers: {},
    packages: {},
    resolvers: [],
  });

  // add or remove items by chaining method calls
  builder
    .setPackage("wrap://plugin/package", httpPlugin({}) as IWrapPackage)
    .removePackage("wrap://plugin/package")
    .setPackages({
      "wrap://plugin/http": httpPlugin({}) as IWrapPackage,
      "wrap://plugin/filesystem": fileSystemPlugin({}) as IWrapPackage,
    });
```

You can add the entire [default client configuration bundle](#bundle--defaultconfig) at once with [addDefaults](#adddefaults)

```typescript
  builder.addDefaults();
```

### Build

Finally, build a ClientConfig or CoreClientConfig to pass to the PolywrapClient constructor.

```typescript
  // accepted by either the PolywrapClient or the PolywrapCoreClient
  let coreClientConfig = builder.build();

  // build with a custom cache
  coreClientConfig = builder.build({
    resolutionResultCache: new ResolutionResultCache(),
  });

  // or build with a custom resolver
  coreClientConfig = builder.build({
    resolver: RecursiveResolver.from([]),
  });
```

### Example

A complete example using all or most of the available methods.

```typescript
  // init
  const builder = new PolywrapClientConfigBuilder();

  // add the default bundle first to override its entries later
  builder.addDefaults();

  // add many config items at once
  builder.add({
    envs: {},
    interfaces: {},
    redirects: {},
    wrappers: {},
    packages: {},
    resolvers: [],
  });

  // add and remove wrappers
  builder
    .setWrapper(
      "wrap://ens/wrapper.eth",
      await WasmWrapper.from(
        new Uint8Array([1, 2, 3]),
        new Uint8Array([1, 2, 3])
      )
    )
    .removeWrapper("wrap://ens/wrapper.eth")
    .setWrappers({
      "wrap://ens/wrapper.eth": await WasmWrapper.from(
        new Uint8Array([1, 2, 3]),
        new Uint8Array([1, 2, 3])
      ),
    });

  // add and remove wrap packages
  builder
    .setPackage("wrap://plugin/package", httpPlugin({}) as IWrapPackage)
    .removePackage("wrap://plugin/package")
    .setPackages({
      "wrap://plugin/package": httpPlugin({}) as IWrapPackage,
    });

  // add and remove Envs
  builder
    .addEnv("wrap://ens/wrapper.eth", { key: "value" })
    .removeEnv("wrap://ens/wrapper.eth")
    .addEnvs({
      "wrap://ens/wrapper.eth": { key: "value" },
    });

  // override existing Env, or add new Env if one is not registered at URI
  builder.setEnv("wrap://ens/wrapper.eth", { key: "value" });

  // add or remove registration for an implementation of an interface
  builder
    .addInterfaceImplementation(
      "wrap://ens/interface.eth",
      "wrap://ens/wrapper.eth"
    )
    .removeInterfaceImplementation(
      "wrap://ens/interface.eth",
      "wrap://ens/wrapper.eth"
    )
    .addInterfaceImplementations("wrap://ens/interface.eth", [
      "wrap://ens/wrapper.eth",
    ]);

  // add or remove URI redirects
  builder
    .setRedirect("wrap://ens/from.eth", "wrap://ens/to.eth")
    .removeRedirect("wrap://ens/from.eth")
    .setRedirects({
      "wrap://ens/from.eth": "wrap://ens/to.eth",
    });

  // add resolvers
  builder.addResolver(RecursiveResolver.from([]));
  builder.addResolvers([]);

  // build
  const clientConfig = builder.build();
```

# Reference

## ClientConfigBuilder

### Constructor
```ts
  /**
   * Instantiate a PolywrapClientConfigBuilder
   */
  constructor() 
```

### add
```ts
  /**
   * Add a partial BuilderConfig
   * This is equivalent to calling each of the plural add functions: `addEnvs`, `setWrappers`, etc.
   *
   * @param config: a partial BuilderConfig
   * @returns ClientConfigBuilder (mutated self)
   */
  add(config: Partial<BuilderConfig>): ClientConfigBuilder;
```

### setWrapper
```ts
  /**
   * Add an embedded wrapper
   *
   * @param uri: uri of wrapper
   * @param wrapper: wrapper to be added
   * @returns ClientConfigBuilder (mutated self)
   */
  setWrapper(uri: string, wrapper: Wrapper): ClientConfigBuilder;
```

### setWrappers
```ts
  /**
   * Add one or more embedded wrappers.
   * This is equivalent to calling setWrapper for each wrapper.
   *
   * @param uriWrappers: an object where keys are uris and wrappers are value
   * @returns ClientConfigBuilder (mutated self)
   */
  setWrappers(uriWrappers: Record<string, Wrapper>): ClientConfigBuilder;
```

### removeWrapper
```ts
  /**
   * Remove an embedded wrapper
   *
   * @param uri: the wrapper's URI
   * @returns ClientConfigBuilder (mutated self)
   */
  removeWrapper(uri: string): ClientConfigBuilder;
```

### setPackage
```ts
  /**
   * Add an embedded wrap package
   *
   * @param uri: uri of wrapper
   * @param wrapPackage: package to be added
   * @returns ClientConfigBuilder (mutated self)
   */
  setPackage(uri: string, wrapPackage: IWrapPackage): ClientConfigBuilder;
```

### setPackages
```ts
  /**
   * Add one or more embedded wrap packages
   * This is equivalent to calling setPackage for each package
   *
   * @param uriPackages: an object where keys are uris and packages are value
   * @returns ClientConfigBuilder (mutated self)
   */
  setPackages(uriPackages: Record<string, IWrapPackage>): ClientConfigBuilder;
```

### removePackage
```ts
  /**
   * Remove an embedded wrap package
   *
   * @param uri: the package's URI
   * @returns ClientConfigBuilder (mutated self)
   */
  removePackage(uri: string): ClientConfigBuilder;
```

### addEnv
```ts
  /**
   * Add an Env.
   * If an Env is already associated with the uri, it is modified.
   *
   * @param uri: the wrapper's URI to associate with the Env
   * @param env: an object with the env variables for the uri
   * @returns ClientConfigBuilder (mutated self)
   */
  addEnv(uri: string, env: Record<string, unknown>): ClientConfigBuilder;
```

### addEnvs
```ts
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
```

### removeEnv
```ts
  /**
   * Remove an Env
   *
   * @param uri: the URI associated with the Env
   * @returns ClientConfigBuilder (mutated self)
   */
  removeEnv(uri: string): ClientConfigBuilder;
```

### setEnv
```ts
  /**
   * Add an Env.
   * If an Env is already associated with the uri, it is replaced.
   *
   * @param uri: the wrapper's URI to associate with the Env
   * @param env: an object with the environment variables for the uri
   * @returns ClientConfigBuilder (mutated self)
   */
  setEnv(uri: string, env: Record<string, unknown>): ClientConfigBuilder;
```

### addInterfaceImplementation
```ts
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
```

### addInterfaceImplementations
```ts
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
```

### removeInterfaceImplementation
```ts
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
```

### setRedirect
```ts
  /**
   * Add a redirect from one URI to another
   *
   * @param from: the URI to redirect from
   * @param to: the URI to redirect to
   * @returns ClientConfigBuilder (mutated self)
   */
  setRedirect(from: string, to: string): ClientConfigBuilder;
```

### setRedirects
```ts
  /**
   * Add an array of URI redirects
   *
   * @param redirects: an object where key is from and value is to
   * @returns ClientConfigBuilder (mutated self)
   */
  setRedirects(redirects: Record<string, string>): ClientConfigBuilder;
```

### removeRedirect
```ts
  /**
   * Remove a URI redirect
   *
   * @param from: the URI that is being redirected
   * @returns ClientConfigBuilder (mutated self)
   */
  removeRedirect(from: string): ClientConfigBuilder;
```

### addResolver
```ts
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
```

### addResolvers
```ts
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
```

### addDefaults
```ts
  /**
   * Add the default configuration bundle
   *
   * @returns ClientConfigBuilder (mutated self)
   */
  addDefaults(): ClientConfigBuilder;
```

### addBundle
```ts
  /**
   * Add a default configuration bundle
   *
   * @returns Promise<ClientConfigBuilder> (mutated self)
   */
  addBundle(bundle: BundleName): ClientConfigBuilder;
```

### build
```ts
  /**
   * Build a sanitized core client configuration that can be passed to the PolywrapClient or PolywrapCoreClient constructors
   *
   * @param options - Use a custom wrapper cache or resolver
   * @returns CoreClientConfig that results from applying all the steps in the builder pipeline
   */
  build(options?: BuildOptions): CoreClientConfig;
```

## Bundles

```ts
export type BundleName = "sys" | "web3";

```
* [sys](https://www.npmjs.com/package/@polywrap/sys-config-bundle-js)
* [web3](https://www.npmjs.com/package/@polywrap/web3-config-bundle-js)
