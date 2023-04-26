$start: helpers.md

## getUriResolutionPath

```ts
$snippet: getUriResolutionPath
```

## InfiniteLoopError

```ts
$snippet: InfiniteLoopError
```

### constructor

```ts
$snippet: InfiniteLoopError-constructor
```

## ResolverWithHistory

```ts
$snippet: ResolverWithHistory
```

### Methods

#### tryResolveUri

```ts
$snippet: ResolverWithHistory-tryResolveUri
```

#### getStepDescription (protected)

```ts
$snippet: ResolverWithHistory-getStepDescription
```

#### \_tryResolveUri (protected)

```ts
$snippet: ResolverWithHistory-_tryResolveUri
```

## ResolverWithLoopGuard

```ts
$snippet: ResolverWithLoopGuard
```

### constructor

```ts
$snippet: ResolverWithLoopGuard-constructor
```

### Methods

#### from

```ts
$snippet: ResolverWithLoopGuard-from
```

#### tryResolveUri

```ts
$snippet: ResolverWithLoopGuard-tryResolveUri
```

## PackageToWrapperResolver

```ts
$snippet: PackageToWrapperResolver
```

### constructor

```ts
$snippet: PackageToWrapperResolver-constructor
```

### Methods

#### from

```ts
$snippet: PackageToWrapperResolver-from
```

#### tryResolveUri

```ts
$snippet: PackageToWrapperResolver-tryResolveUri
```

## UriResolver

```ts
$snippet: UriResolver
```

### Methods

#### from

```ts
$snippet: UriResolver-from
```

## UriResolverLike

```ts
$snippet: UriResolverLike
```

## UriResolutionResult
```ts
/** Factory for creating Result from URI resolution output */
export class UriResolutionResult<TError = undefined> 
```

### Methods

#### ok
```ts
  /** Returns a Result with `ok` set to true */
  static ok<TError = undefined>(uri: Uri): Result<UriPackageOrWrapper, TError>;
  static ok<TError = undefined>(
    uri: Uri,
    wrapPackage: IWrapPackage
  ): Result<UriPackageOrWrapper, TError>;
  static ok<TError = undefined>(
    uri: Uri,
    wrapper: Wrapper
  ): Result<UriPackageOrWrapper, TError>;
  static ok<TError = undefined>(
    uriPackageOrWrapper: UriPackageOrWrapper
  ): Result<UriPackageOrWrapper, TError>;
  static ok<TError = undefined>(
    uriPackageOrWrapper: Uri | UriPackageOrWrapper,
    packageOrWrapper?: IWrapPackage | Wrapper
  ): Result<UriPackageOrWrapper, TError> 
```

#### err
```ts
  /** Returns a Result with `ok` set to false */
  static err<TError = unknown>(
    error: TError
  ): Result<UriPackageOrWrapper, TError> 
```

$end
