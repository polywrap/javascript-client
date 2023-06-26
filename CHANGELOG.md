# Polywrap Origin (0.11.0)
## Features
**`@polywrap/client-config-builder-js`:**
* [PR-45](https://github.com/polywrap/javascript-client/pull/45) **Modular Config Bundles**
  * The `DefaultBundle` has been broken apart into two separate bundles: `sys` and `web3`.
  * `addBundle(...)` has been added to the `ClientConfigBuilder` interface.
  * `addDefaults()` now calls `addBundle("sys")` and `addBundle("web3")` internally.

**`@polywrap/sys-config-bundle-js`:**
* [PR-45](https://github.com/polywrap/javascript-client/pull/45) **Bundled System-Level Plugins & Resolvers**
  * The sys bundle includes: `logger`, `datetime`, `concurrent`, `http`, `httpResolver`
  * This package is compiled to run in both node.js and browsers.
  * In node.js, the bundle also includes: `fileSystem`, `fileSystemResolver`.

**`@polywrap/web3-config-bundle-js`:**
* [PR-45](https://github.com/polywrap/javascript-client/pull/45) **Bundled Web3 Plugins & Resolvers**
  * The web3 bundle includes: `ethereumProviderV1`, `ethereumProviderV2`, `ipfsHttpClient`, `ipfsResolver`, `ensTextRecordResolver`, `ensResolver`, `ensIpfsContenthashResolver`.

**`@polywrap/config-bundle-types-js`:**
* [PR-45](https://github.com/polywrap/javascript-client/pull/45) **Base Typings For Config Bundle Packages**
  * Valid config bundle packages are expected to export a `bundle` value, which is of type `Bundle`.

## Breaking Changes
**`@polywrap/core-js`:**
* [PR-32](https://github.com/polywrap/javascript-client/pull/32) **Rename `getEnvFromUriHistory` to `getEnvFromResolutionPath`**

## Bugs
**`@polywrap/client-js`**
* [PR-32](https://github.com/polywrap/javascript-client/pull/32) **Improved Browser Compatability**
  * Building the JS client into browser-based applications no longer requires custom polyfills to remove Node.JS dependencies.

**`@polywrap/client-cofig-builder-js`**
* [PR-37](https://github.com/polywrap/javascript-client/pull/37) **Add `@polywrap/plugin-js` as a Dependency**
  * This resolves some package resolution warnings that are emitted from npm when installing the client-config-builder.

**`@polywrap/wasm-js`:**
* [PR-30](https://github.com/polywrap/javascript-client/pull/30) **Properly Serialize Empty Wrap Environment**
  * The wrap environment was being improperly encoded as an empty object, which had a size > 0 bytes, causing deserialization to fail. This has been fixed and it is now an empty byte array with size of 0.

# Polywrap Origin (0.10.1)
## Features
**`@polywrap/wasm-js`:**
* [PR-3](https://github.com/polywrap/javascript-client/pull/3) **WasmWrapper Subinvcations Now Retain The Resolution Context**
  * Added `resolutionContext` to the `WasmWrapper`'s state.
  * Pass the `resolutionContext` through to all subinvocations.

## Bugs
**`@polywrap/client-config-builder-js`**
* [PR-8](https://github.com/polywrap/javascript-client/pull/8) **`tryResolveUri` Now Returns Wrap Packages**
  * The default resolver should not automatically convert packages to wrappers. Based on this, the `PackageToWrapperResolver` has been removed from the default config bundle.

**`@polywrap/core-client-js`:**
* [PR-3](https://github.com/polywrap/javascript-client/pull/3) **Properly Track Subinvocation Resolution Contexts**
  * Instead of passing the core resolution context to the resolution and invocation processes, seperate sub contexts are created for them. This means that subinvokes will now be tracked in the resolution context.

**`@polywrap/plugin-js`:**
* [PR-3](https://github.com/polywrap/javascript-client/pull/3) **Properly Track Subinvocation Resolution Contexts**
  * The client instance provided to plugin methods has been wrapped, enabling the automatic tracking of all subinvocation resolution contexts.

# Polywrap Origin (0.10.0)
## Features
**`@polywrap/client-js`:**
* [PR-1582](https://github.com/polywrap/toolchain/pull/1582) **Support ENS Text Record WRAP URIs**
  * Support has been added for using ENS text records as valid `wrap://` URIs.
  * Example: [`wrap://ens/uniswap.wraps.eth:v3`](https://app.ens.domains/name/uniswap.wraps.eth/details)
  * NOTE: Text record key names must begin with `wrap/`
* [PR-1431](https://github.com/polywrap/toolchain/pull/1431) **WRAP Error Structure**
  * Integrate the `WrapError` structure, helping debug common client error scenarios.
* [PR-1340](https://github.com/polywrap/toolchain/pull/1340) **Wrapper Validation**
  * Added a `validate(uri, options)` method to the `PolywrapClient` class, allowing users to guarantee the client can communicate with the provided wrapper located at the provided URI.
* [PR-1236](https://github.com/polywrap/toolchain/pull/1236) **Plugin Refactor**
  * Polywrap Client now re-exports the config builder and uri-resolvers (in addition to core) packages. This is done to improve dev exp and remove the need for users to import those package themselves.
    * For users who do not need those packages and are using noDefaults there will be a separate PR that refactor core client functionality into a core-client package that does not depend on the config builder and uri-resolvers packages, but has no defaults.

**`@polywrap/client-config-builder-js`:**
* [PR-1582](https://github.com/polywrap/toolchain/pull/1582) **Integrate URI Resolver Extension Wraps**
  * The default configuration bundle now has the following uri-resolver-ext wraps registered as interface implementations:
    * [`wrap://ens/wraps.eth:ipfs-uri-resolver-ext@1.0.0](https://github.com/polywrap/uri-resolver-extensions/tree/master/implementations/ipfs)
    * [`wrap://ens/wraps.eth:ens-text-record-uri-resolver-ext@1.0.0`](https://github.com/polywrap/uri-resolver-extensions/tree/master/implementations/ens-text-record)
    * [`wrap://ens/wraps.eth:http-uri-resolver-ext@1.0.0`](https://github.com/polywrap/uri-resolver-extensions/tree/master/implementations/http)
    * [`wrap://ens/wraps.eth:file-system-uri-resolver-ext@1.0.0`](https://github.com/polywrap/uri-resolver-extensions/tree/master/implementations/file-system)
    * [`wrap://ens/wraps.eth:ens-uri-resolver-ext@1.0.0`](https://github.com/polywrap/uri-resolver-extensions/tree/master/implementations/ens-contenthash)
    * [`wrap://ens/wraps.eth:ens-ipfs-contenthash-uri-resolver-ext@1.0.0`](https://github.com/polywrap/uri-resolver-extensions/tree/master/implementations/ens-ipfs-contenthash)
* [PR-1560](https://github.com/polywrap/toolchain/pull/1560) **Add `BuildOptions` to build method in `IClientConfigBuilder`**
  * This makes it possible to add a custom cache or resolver without casting.
* [PR-1475](https://github.com/polywrap/toolchain/pull/1475) **Embed IPFS HTTP Client & IPFS URI Resolver Wraps**
  * The default configuration bundle now comes with two embedded wraps that enable interactions with IPFS:
    * `ipfs-http-client` @ `wrap://ens/wraps.eth:ipfs-http-client@1.0.0`
    * `async-ipfs-uri-resolver-ext` @ `wrap://ens/wraps.eth:async-ipfs-uri-resolver-ext@1.0.1`
* [PR-1518](https://github.com/polywrap/toolchain/pull/1518) **Optional Build Method Arguments**
  * The `build(...)` method now accepts a single argument of type `BuildOptions`.
* [PR-1496](https://github.com/polywrap/toolchain/pull/1496) **Use New Concurrent Wrapper**
  * The default config bundle now uses the `wrap://ens/wrappers.polywrap.eth:concurrent@1.0.0` interface, and adds the `concurrent-plugin-js` package @ `wrap://plugin/concurrent` as an implementation.
* [PR-1468](https://github.com/polywrap/toolchain/pull/1468) **Export Default Config Bundle URIs**
  * The default config now exports constants for all URIs used within the config.
* [PR-1436](https://github.com/polywrap/toolchain/pull/1436) **Use New Logger Wrapper**
  * The default config bundle now uses the `wrap://ens/wrappers.polywrap.eth:logger@1.0.0` interface, and adds the `@polywrap/logger-plugin-js` package @ `wrap://plugin/logger` as an implementation.
* [PR-1411](https://github.com/polywrap/toolchain/pull/1411) **Add `ens-text-record-resolver` to Default Config Bundle**
  * The `ens-text-record-resolver` wrapper @ [`wrap://ipfs/QmfRCVA1MSAjUbrXXjya4xA9QHkbWeiKRsT7Um1cvrR7FY`](https://wrappers.io/v/ipfs/QmfRCVA1MSAjUbrXXjya4xA9QHkbWeiKRsT7Um1cvrR7FY) has been added to the default client config bundle. This resolver enables ENS, text-record based, WRAP URI resolution. The text-record's key must be prepended with the `wrap/...` identifier. For example, the URI `wrap://ens/domain.eth:foo` maps to `domain.eth`'s `wrap/foo` text record. The `wrap/foo` text-record's value must contain another valid WRAP URI. For examples, see [dev.polywrap.eth](https://app.ens.domains/name/dev.polywrap.eth/details).
* [PR-1236](https://github.com/polywrap/toolchain/pull/1236) **Plugin Refactor**
  * Added `addRedirects`, `addWrappers`, `addPackages` methods to the `ClientConfigBuilder`, so users can add many items at once.
  * Added `buildDefault` to the `ClientConfigBuilder` which builds a `ClientConfig` using default resolvers.

**`@polywrap/plugin-js`:**
* [PR-1614](https://github.com/polywrap/toolchain/pull/1614) **Add `env` To `PluginModule` Invocation Method Arguments**
  * `PluginModule` invocation methods will now be given an `env` the method's arguments.
* [PR-1236](https://github.com/polywrap/toolchain/pull/1236) **Plugin Refactor**
  * New package for js plugins.
  * Can create plugin packages with `PluginPackage.from`.
    * Accepts `manifest` and a `PluginModule`, or an inline `PluginModule`.

**`@polywrap/uri-resolvers-js`:**
* [PR-1646](https://github.com/polywrap/toolchain/pull/1646) **Resolution Result Cache Resolver**
  * Added a new cache resolver `ResolutionResultCacheResolver`.
  * Unlike the `WrapperCacheResolver`, which caches wrappers (URI => Wrapper), this resolver caches the result of the resolution process: URI, wrapper, package or error (URI => URI, URI => wrapper, URI => package, URI => error).
  * By default, it does not cache errors, but a flag can be passed to enable that functionality.
* [PR-1528](https://github.com/polywrap/toolchain/pull/1528) **Request Synchronizer Resolver**
  * With URI resolvers, multiple requests for the same URI, in most cases, needlessly repeat the same process (usually a network request). Using a cache resolver (like PackageToWrapperCacheResolver) helps if the resolution requests are synchronous (one after another). This new `RequestSynchronizerResolver` can be used to reuse parallel requests for the same URI, this way, only the first one needs to do the work (e.g. a network request) while others will await that same promise.
* [PR-1236](https://github.com/polywrap/toolchain/pull/1236) **Plugin Refactor**
  * Added `StaticResolver` and `StaticResolver.from` to optimize building resolvers with `IUriRedirect`, `IUriWrapper` and `IUriPackage`.

**`@polywrap/uri-resolver-extensions-js`:**
* [PR-1582](https://github.com/polywrap/toolchain/pull/1582) **Update Default URI-Resolver-Ext Interface URI**
  * The `ExtendableUriResolver` has been updated to get uri-resolver-ext implementations from the following interface URIs:
    * `wrap://ens/wraps.eth:uri-resolver-ext@1.1.0`
    * `wrap://ens/wraps.eth:uri-resolver-ext@1.0.0`

**`@polywrap/core-js`:**
* [PR-1431](https://github.com/polywrap/toolchain/pull/1431) **WRAP Error Structure**
  * Created a custom `WrapError` structure that improves debugging ability for common client error scenarios.
* [PR-1369](https://github.com/polywrap/toolchain/pull/1369) **Remove Legacy Redirects**
  * `GetImplementationsOptions` now accepts an optional resolution context, to be used to handle infinite recursion when a resolver uses `getImplementations`
  * `GetImplementationsOptions` now accepts an optional `applyResolution`. This can be used to apply URI resolution to interfaces.

**`@polywrap/logging-js`:**
* [PR-1379](https://github.com/polywrap/toolchain/pull/1379) **Create `@polywrap/logging-js` Package**
  * Created the `@polywrap/logging-js` package from the logging lib previously in the CLI's codebase.

**`@polywrap/http-plugin-js`:**
* [PR-1471](https://github.com/polywrap/toolchain/pull/1471) **Add form-data Support**
  * Added form-data support through the inclusion of the `formData: [FormDataEntry!]` property on the `Request` object.

## Breaking Changes
**`@polywrap/client-js`:**
* [PR-1534](https://github.com/polywrap/toolchain/pull/1534) **Remove legacy config types from `PolywrapClient`**
  * The `PolywrapClient` now simply accepts a `CoreClientConfig`, which is expected to come from the config builder.
* [PR-1461](https://github.com/polywrap/toolchain/pull/1461) **Remove Legacy Invocation Methods**
  * Remove `client.query(...)` & `client.subscribe(...)` methods.
* [PR-1369](https://github.com/polywrap/toolchain/pull/1369) **Remove Legacy Redirects**
  * `PolywrapClient` config when using `noDefaults: true` no longer accepts `redirects` (Since redirects have been removed from `CoreClientConfig`).
* [PR-1236](https://github.com/polywrap/toolchain/pull/1236) **Plugin Refactor**
  * The Polywrap Client with `noDefaults: false` no longer accepts a `plugins` field, but it accepts `wrappers` and `packages`.
    * `resolver` field has been replaced with `resolvers`, since with default client the resolver used is the `RecursiveResolver` with the `PackageToWrapperCacheResolver`.
  * The Polywrap Client with `noDefaults: true`, no longer accepts a `plugins` field. It is expected that devs using this option will manually configure their own resolver.
  * removed `getPlugins` and `getPluginByUri`. Will add `getWrapper`, `getWrapperByUri`, `getPackage`, `getPackageByUri`, in a follow up PR.
  * `createPolywrapClient` function has been deprecated.
* [PR-1534](https://github.com/polywrap/toolchain/pull/1534) **Remove legacy config types from PolywrapClient**
  * The `PolywrapClient`'s constructor now accepts only an optional `CoreClientConfig` type as its configuration object.
  * It is now advised to use the `ClientConfigBuilder` found in `@polywrap/client-config-builder-js` and exported by `@polywrap/client-js` in order to set up their client configurations.

**`@polywrap/client-config-builder-js`:**
* [PR-1480](https://github.com/polywrap/toolchain/pull/1480) **ClientConfigBuilder-specific `BuilderConfig` Object**
  * The `ClientConfigBuilder` now uses a specific `BuilderConfig` that is easier for users to work with. It will then be turned into a `CoreClientConfig` through the use of the `build()` method.
* [PR-1498](https://github.com/polywrap/toolchain/pull/1498) **Refactor `ClientConfigBuilder.build()`**
  * Rename `buildCoreConfig()` to `build()`, which returns a `CoreClientConfig` instance.
* [PR-1494](https://github.com/polywrap/toolchain/pull/1494) **Deprecate Legacy HTTP URIs in Default Config Bundle**
  * The `wrap://ens/http.polywrap.eth` interface and wrapper have been removed from the default configuration bundle.
* [PR-1436](https://github.com/polywrap/toolchain/pull/1436) **Deprecate Legacy Logger URIs in Default Config Bundle**
  * The `wrap://ens/logger.core.polywrap.eth` interface and the `wrap://ens/js-logger.polywrap.eth` plugin wrapper have both been removed from the default configuration bundle.
* [PR-1446](https://github.com/polywrap/toolchain/pull/1446) **Deprecate Legacy Ethereum URI in Default Config Bundle**
  * The `wrap://ens/ethereum.polywrap.eth` URI + wrap has been removed from the default configuration bundle.
* [PR-1475](https://github.com/polywrap/toolchain/pull/1475) **Deprecate Legacy IPFS URIs in Default Config Bundle**
  * The `wrap://ens/ipfs.polywrap.eth` & `wrap://ens/ipfs-resolver.polywrap.eth` URIs + wraps have been removed from the default configuration bundle.
* [PR-1369](https://github.com/polywrap/toolchain/pull/1369) **Remove Legacy Redirects**
  * Calling `buildCoreConfig` no longer returns a `CoreClientConfig` with redirects since redirects are no longer a part of `CoreClientConfig`.
* [PR-1367](https://github.com/polywrap/toolchain/pull/1367) **URI Redirect Renaming**
  * Renamed `removeUriRedirect(...)` to `removeRedirePR-15e `plugins` and a `resolver`, but now has `wrappers`, `packages` and `resolvers`
  * Calling build returns an instance of the `CustomClientConfig`, which can be used with defaults from the `PolywrapClient`, but can not be used if `noDefaults: true` is passed to the `PolywrapClient` constructor.
  * Removed `addPlugin` from the `ClientConfigBuilder`, users can now use `addWrapper` or `addPackage` where appropriate.

**`@polywrap/plugin-js`:**
* [PR-1614](https://github.com/polywrap/toolchain/pull/1614) **Remove `env` Property From `PluginModule`**
  * `PluginModule` instances no longer have an `env` property, and instead will be given an `env` within the invocation method's arguments.

**`@polywrap/core-js`:**
* [PR-1613](https://github.com/polywrap/toolchain/pull/1613) **Core Client Config Unique Maps**
  * The `CoreClientConfig` now `ReadonlyUriMap`s for its `interface` and `env` properties.
* [PR-1369](https://github.com/polywrap/toolchain/pull/1369) **Remove Legacy Redirects**
  * `redirects` are no longer a part of `CoreClientConfig`.
  * `getRedirects` are no longer a part of `CoreClient`.
  * `getUriResolver` on `CoreClient` has been renamed to `getResolver`.
  * `getImplementations` returns a promise now.
  * `GetImplementationsOptions` no longer accepts `applyRedirects`. This has been replaces with `applyResolution`.
  * `applyRedirects` helper function has been replaced with `applyResolution`.
* [PR-1236](https://github.com/polywrap/toolchain/pull/1236) **Plugin Refactor**
  * Plugins are no longer a part of this package, they have been moved to the plugin-js package
  * Renamed `UriRedirect` to `IUriRedirect` to match `IUriWrapper` and `IUriPackage`
  * `IUriRedirect`, `IUriWrapper` and `IUriPackage` are now generic and their generic param implements `Uri | string`
  * Removed `options` argument from `client.getManifest` method since all wrappers have a deserialized manifest

**`@polywrap/uri-resolvers-js`:**
* [PR-1586](https://github.com/polywrap/toolchain/pull/1586) **Separate the `PackageToWrapperCacheResolver` Into Two Resolvers**
  * The `PackageToWrapperCacheResolver` has been split into the `PackageToWrapperResolver` & `WrapperCacheResolver` resolvers.
* [PR-1369](https://github.com/polywrap/toolchain/pull/1369) **Remove Legacy Redirects**
  * `LegacyRedirectsResolver` has been removed.
* [PR-1236](https://github.com/polywrap/toolchain/pull/1236) **Plugin Refactor**
  * Replaced helper func `buildUriResolver` with `UriResolver.from`
  * Constructors of built-in resolvers like `RecursiveResolver` and `PackageToWrapperCacheResolver` now accept a concrete `IUriResolver` while their static `from` methods accept a `UriResolverLike` 
  * Remove `PluginsResolver` and `PluginResolver`, users can now use `WrapperResolver` or `PackageResolver`

**`@polywrap/uri-resolver-extensions-js`:**
* [PR-1582](https://github.com/polywrap/toolchain/pull/1582) **Remove Legacy uri-resolver-ext Interface URI**
  * The `ExtendableUriResolver` no longer supports the legacy interface URI `wrap://ens/uri-resolver.core.polywrap.eth`.

**`@polywrap/react`:**
* [PR-1236](https://github.com/polywrap/toolchain/pull/1236) **Plugin Refactor**
  * Replaced `plugins` on the `PolywrapProvider` with `wrappers` and `packages`

**`@polywrap/http-plugin-js`:**
* [PR-1494](https://github.com/polywrap/toolchain/pull/1494) Migrated to [polywrap/http](https://github.com/polywrap/http)

**`@polywrap/fs-plugin-js`:**
* [PR-1495](https://github.com/polywrap/toolchain/pull/1495) Migrate to [polywrap/file-system](https://github.com/polywrap/file-system)

**`@polywrap/ws-plugin-js`:**
* [PR-1547](https://github.com/polywrap/toolchain/pull/1547) Migrate to [polywrap/websocket](https://github.com/polywrap/websocket)

**`@polywrap/ethereum-plugin-js`:**
* [PR-1446](https://github.com/polywrap/toolchain/pull/1446) Deprecated in favor of the [polywrap/ethereum](https://github.com/polywrap/ethereum) wasm-based wrap

**`@polywrap/ipfs-plugin-js`:**
* [PR-1475](https://github.com/polywrap/toolchain/pull/1475) Deprecated in favor of the [polywrap/ipfs](https://github.com/polywrap/ipfs) wasm-based wrap

**`@polywrap/http-interface`:**
* [PR-1494](https://github.com/polywrap/toolchain/pull/1494) Migrated to [polywrap/http](https://github.com/polywrap/http)

**`@polywrap/file-system-interface`:**
* [PR-1495](https://github.com/polywrap/toolchain/pull/1495) Migrate to [polywrap/file-system](https://github.com/polywrap/file-system)

## Bugs
**`@polywrap/core-js`:**
* [PR-1593](https://github.com/polywrap/toolchain/pull/1593) **Display decoded args when errors are thrown in subinvocations**
  * Args used to be displayed as-is in error messages when errors were thrown in Wasm wrapper invocations. This meant args for subinvocations were byte arrays. Now the args are always decoded for errors so they are human-readable.
* [PR-1556](https://github.com/polywrap/toolchain/pull/1556) **`WrapError` now correctly parses Rust unwrap errors**
  * When calling `.unwrap()` on a Rust result that contains an error, Rust will panic with an error message that contains the Err. For fidelity to the original Err, Rust inserts escape characters in the string. For example, "\n" becomes "\\n". This behavior was not being handled correctly by WrapError's string parsing logic.

**`@polywrap/uri-resolvers-extensions-js`:**
* [PR-1487](https://github.com/polywrap/toolchain/pull/1487) **Handle `null` URI Resolver Extension Return Results**
  * Update the `MaybeUriOrManifest` & `getFile` interfaces to properly reflect the URI resolver extension interface.
