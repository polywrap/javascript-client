/// NOTE: This is an auto-generated file.
///       All modifications will be overwritten.

export const schema: string = `### Web3API Header START ###
scalar UInt
scalar UInt8
scalar UInt16
scalar UInt32
scalar Int
scalar Int8
scalar Int16
scalar Int32
scalar Bytes
scalar BigInt
scalar JSON
scalar Map

directive @imported(
  uri: String!
  namespace: String!
  nativeType: String!
) on OBJECT | ENUM

directive @imports(
  types: [String!]!
) on OBJECT

directive @capability(
  type: String!
  uri: String!
  namespace: String!
) repeatable on OBJECT

directive @enabled_interface on OBJECT

directive @annotate(type: String!) on FIELD

### Web3API Header END ###

type Query implements UriResolver_Query @imports(
  types: [
    "UriResolver_Query",
    "UriResolver_MaybeUriOrManifest"
  ]
) {
  tryResolveUri(
    authority: String!
    path: String!
  ): UriResolver_MaybeUriOrManifest

  getFile(
    path: String!
  ): Bytes
}

### Imported Queries START ###

type UriResolver_Query @imported(
  uri: "ens/uri-resolver.core.web3api.eth",
  namespace: "UriResolver",
  nativeType: "Query"
) {
  tryResolveUri(
    authority: String!
    path: String!
  ): UriResolver_MaybeUriOrManifest

  getFile(
    path: String!
  ): Bytes
}

### Imported Queries END ###

### Imported Objects START ###

type UriResolver_MaybeUriOrManifest @imported(
  uri: "ens/uri-resolver.core.web3api.eth",
  namespace: "UriResolver",
  nativeType: "MaybeUriOrManifest"
) {
  uri: String
  manifest: String
}

### Imported Objects END ###
`;
