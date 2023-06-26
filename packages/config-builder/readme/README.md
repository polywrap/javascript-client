# PolywrapClient Config Builder

A utility class for building the PolywrapClient config. 

Supports building configs using method chaining or imperatively.

## Quickstart

### Initialize

Initialize a ClientConfigBuilder using the [constructor](#constructor)

```typescript
$snippet: quickstart-initialize
```

### Configure

Add client configuration with [add](#add), or flexibly mix and match builder [configuration methods](#setWrapper) to add and remove configuration items.

```typescript
$snippet: quickstart-configure
```

You can add the entire [default client configuration bundle](#bundle--defaultconfig) at once with [addDefaults](#adddefaults)

```typescript
$snippet: quickstart-addDefaults
```

### Build

Finally, build a ClientConfig or CoreClientConfig to pass to the PolywrapClient constructor.

```typescript
$snippet: quickstart-build
```

### Example

A complete example using all or most of the available methods.

```typescript
$snippet: quickstart-example
```

# Reference

## ClientConfigBuilder

### Constructor
```ts
$snippet: ClientConfigBuilder-constructor
```

### add
```ts
$snippet: ClientConfigBuilder-add
```

### setWrapper
```ts
$snippet: ClientConfigBuilder-setWrapper
```

### setWrappers
```ts
$snippet: ClientConfigBuilder-setWrappers
```

### removeWrapper
```ts
$snippet: ClientConfigBuilder-removeWrapper
```

### setPackage
```ts
$snippet: ClientConfigBuilder-setPackage
```

### setPackages
```ts
$snippet: ClientConfigBuilder-setPackages
```

### removePackage
```ts
$snippet: ClientConfigBuilder-removePackage
```

### addEnv
```ts
$snippet: ClientConfigBuilder-addEnv
```

### addEnvs
```ts
$snippet: ClientConfigBuilder-addEnvs
```

### removeEnv
```ts
$snippet: ClientConfigBuilder-removeEnv
```

### setEnv
```ts
$snippet: ClientConfigBuilder-setEnv
```

### addInterfaceImplementation
```ts
$snippet: ClientConfigBuilder-addInterfaceImplementation
```

### addInterfaceImplementations
```ts
$snippet: ClientConfigBuilder-addInterfaceImplementations
```

### removeInterfaceImplementation
```ts
$snippet: ClientConfigBuilder-removeInterfaceImplementation
```

### setRedirect
```ts
$snippet: ClientConfigBuilder-setRedirect
```

### setRedirects
```ts
$snippet: ClientConfigBuilder-setRedirects
```

### removeRedirect
```ts
$snippet: ClientConfigBuilder-removeRedirect
```

### addResolver
```ts
$snippet: ClientConfigBuilder-addResolver
```

### addResolvers
```ts
$snippet: ClientConfigBuilder-addResolvers
```

### addDefaults
```ts
$snippet: ClientConfigBuilder-addDefaults
```

### addBundle
```ts
$snippet: ClientConfigBuilder-addBundle
```

### build
```ts
$snippet: ClientConfigBuilder-build
```

## Bundles

```ts
$snippet: Bundles-bundleNames
```
* [sys](https://www.npmjs.com/package/@polywrap/sys-config-bundle-js)
* [web3](https://www.npmjs.com/package/@polywrap/web3-config-bundle-js)
